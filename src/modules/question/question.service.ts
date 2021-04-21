import { Injectable } from '@nestjs/common';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import e from 'express';
import { of } from 'rxjs';
import { PaginatedRequest, PaginatedResponse, YN } from 'src/common';
import { BaseService, BrandAiException } from 'src/core';
import { EntityManager, QueryBuilder, Repository } from 'typeorm';
import { QuestionGiven } from '../question-given/question-given.entity';
import { QuestionTracker } from '../question-tracker/question-tracker.entity';
import {
  AdminQuestionCreateDto,
  AdminQuestionListeDto,
  AdminQuestionUpdateDto,
  QuestionAnsweredDto,
  QuestionQueryDto,
} from './dto';
import { Question } from './question.entity';

@Injectable()
export class QuestionService extends BaseService {
  constructor(
    @InjectRepository(Question)
    private readonly questionRepo: Repository<Question>,
    @InjectEntityManager() private readonly entityManager: EntityManager,
  ) {
    super();
  }

  /**
   * create new question for admin
   * added transaction
   * @param adminQuestionCreateDto
   */
  async createQuestion(
    adminQuestionCreateDto: AdminQuestionCreateDto,
  ): Promise<Question> {
    const newQuestion = await this.entityManager.transaction(
      async entityManager => {
        let newQuestion = new Question(adminQuestionCreateDto);
        newQuestion = await entityManager.save(newQuestion);
        // insert givens if provided
        if (
          adminQuestionCreateDto.providedGivens &&
          adminQuestionCreateDto.providedGivens.length > 0
        ) {
          console.log(adminQuestionCreateDto.providedGivens);
          const newValues = [];
          adminQuestionCreateDto.providedGivens.map(given => {
            console.log(given);
            const newGiven = new QuestionGiven(given);
            newGiven.questionId = newQuestion.id;
            newValues.push(newGiven);
          });
          await entityManager
            .createQueryBuilder()
            .insert()
            .into(QuestionGiven)
            .values(newValues)
            .execute();
        }
        return newQuestion;
      },
    );
    return newQuestion;
  }

  /**
   * update question by admin
   * @param adminQuestionUpdateDto
   * @param id
   */
  async updateQuestion(
    adminQuestionUpdateDto: AdminQuestionUpdateDto,
    id: number,
  ): Promise<Question> {
    let question = await this.questionRepo.findOne(id);
    if (!question) {
      throw new BrandAiException('question.notFound');
    }
    question = question.set(adminQuestionUpdateDto);
    question = await this.questionRepo.save(question);
    return question;
  }

  /**
   * find all for admin
   * @param adminQuestionListDto
   * @param pagination
   */
  async findAllForAdmin(
    adminQuestionListDto: AdminQuestionListeDto,
    pagination: PaginatedRequest,
  ): Promise<PaginatedResponse<Question>> {
    const qb = this.questionRepo
      .createQueryBuilder('question')
      .CustomInnerJoinAndSelect(['commonCode'])
      .AndWhereEqual(
        'question',
        'inUse',
        adminQuestionListDto.inUse,
        adminQuestionListDto.exclude('inUser'),
      )
      .AndWhereEqual(
        'question',
        'isLastQuestion',
        adminQuestionListDto.isLastQuestion,
        adminQuestionListDto.exclude('isLastQuestion'),
      )
      .Paginate(pagination)
      .WhereAndOrder(adminQuestionListDto)
      .getManyAndCount();

    const [items, totalCount] = await qb;

    return { items, totalCount };
  }

  /**
   * find one for admin
   * @param id
   */
  async findOneForAdmin(id: number): Promise<Question> {
    const qb = await this.questionRepo
      .createQueryBuilder('question')
      .CustomInnerJoinAndSelect(['commonCode'])
      .where('question.id = :id', { id: id })
      .getOne();

    return qb;
  }

  /**
   * delete question
   * @param id
   */
  async deleteForAdmin(id: number): Promise<Question> {
    const question = await this.findOneForAdmin(id);
    if (!question) {
      throw new BrandAiException('question.notFound');
    }
    //   delete question
    await this.questionRepo
      .createQueryBuilder('question')
      .delete()
      .from(Question)
      .where('id = :id', { id: id })
      .execute();

    return question;
  }

  /**
   * find one question
   * @param questionQueryDto
   */
  async findQuestion(questionQueryDto: QuestionQueryDto): Promise<Question> {
    const qb = await this.questionRepo
      .createQueryBuilder('question')
      .CustomInnerJoinAndSelect(['commonCode', 'givens'])
      .innerJoinAndSelect('givens.givenDetails', 'givenDetails')
      .WhereAndOrder(questionQueryDto)
      .getOne();

    return qb;
  }

  /**
   * get next question and save record
   * @param questionAnsweredDto
   */
  async questionAnswered(
    questionAnsweredDto: QuestionAnsweredDto,
  ): Promise<Question> {
    const answeredQuestion = await this.entityManager.transaction(
      async entityManager => {
        const answeredQuestion = await this.questionRepo.findOne(
          questionAnsweredDto.questionId,
        );
        if (!answeredQuestion) {
          throw new BrandAiException('question.notFound');
        }
        // too many options
        if (
          answeredQuestion.multipleAnswerYn === YN.NO &&
          questionAnsweredDto.givenId.length > 1
        ) {
          throw new BrandAiException('question.tooManyOptions');
        }
        let newQuestionTracker = new QuestionTracker(questionAnsweredDto);
        newQuestionTracker.userType = answeredQuestion.userType;
        newQuestionTracker = await entityManager.save(newQuestionTracker);
        const findNextQuestion = this.questionRepo
          .createQueryBuilder('question')
          .CustomInnerJoinAndSelect(['commonCode', 'givens'])
          .leftJoinAndSelect('givens.givenDetails', 'givenDetails')
          .where('question.userType = :userType', {
            userType: questionAnsweredDto.userType,
          })
          .andWhere('question.inUse = :inUse', { inUse: YN.YES })
          .andWhere('question.order = :order', {
            order: answeredQuestion.order + 1,
          });
        if (answeredQuestion.hasSubYn === YN.YES) {
          findNextQuestion.andWhere('question.isSubYn = :isSubYn', {
            isSubYn: YN.YES,
          });
          findNextQuestion.andWhere('question.parentId = :parentId', {
            parentId: answeredQuestion.id,
          });
        }
        if (!findNextQuestion) {
          throw new BrandAiException('question.noMoreQuestion');
        }

        const nextQuestion = await findNextQuestion.getMany();
        // filter sub question
        nextQuestion.map(question => {
          if (answeredQuestion.hasSubYn === YN.YES) {
            if (
              questionAnsweredDto.givenId &&
              questionAnsweredDto.givenId.length > 0
            ) {
              const doesInclude = question.triggerIds.includes(
                questionAnsweredDto.givenId[0],
              );
              if (!doesInclude) {
                const index = nextQuestion.indexOf(question);
                nextQuestion.splice(index, 1);
              }
            }
          }
        });
        return nextQuestion[0];
      },
    );
    return answeredQuestion;
  }
}
