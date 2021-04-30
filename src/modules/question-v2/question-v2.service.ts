import { Injectable } from '@nestjs/common';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { YN } from 'src/common';
import { BaseService, BrandAiException } from 'src/core';
import { EntityManager, Repository } from 'typeorm';
import { QuestionV2Tracker } from '../question-tracker-v2/question-tracker-v2.entity';
import { Question } from '../question/question.entity';
import { QuestionV2AnsweredDto, QuestionV2QueryDto } from './dto';
import { QuestionV2 } from './question-v2.entity';

@Injectable()
export class QuestionV2Service extends BaseService {
  constructor(
    @InjectRepository(QuestionV2)
    private readonly questionV2Repo: Repository<QuestionV2>,
    @InjectEntityManager() private readonly entityManager: EntityManager,
  ) {
    super();
  }

  /**
   * find one question
   * @param questionQueryDto
   */
  async findQuestion(
    questionQueryDto: QuestionV2QueryDto,
  ): Promise<QuestionV2> {
    const qb = await this.questionV2Repo
      .createQueryBuilder('question')
      .CustomInnerJoinAndSelect(['commonCode', 'givens', 'questionTypeValue'])
      // .innerJoinAndSelect('givens.givenDetails', 'givenDetails')
      .WhereAndOrder(questionQueryDto)
      .getOne();

    return qb;
  }

  /**
   * answer question
   * @param questionAnsweredDto
   * @returns
   */
  async questionAnswered(
    questionAnsweredDto: QuestionV2AnsweredDto,
  ): Promise<QuestionV2> {
    const answeredQuestion = await this.entityManager.transaction(
      async entityManager => {
        const answeredQuestion = await this.questionV2Repo.findOne(
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
        let newQuestionTracker = new QuestionV2Tracker(questionAnsweredDto);
        newQuestionTracker.userType = answeredQuestion.userType;
        newQuestionTracker = await entityManager.save(newQuestionTracker);
        const findNextQuestion = this.questionV2Repo
          .createQueryBuilder('question')
          .CustomInnerJoinAndSelect(['commonCode', 'givens'])
          // .leftJoinAndSelect('givens.givenDetails', 'givenDetails')
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
