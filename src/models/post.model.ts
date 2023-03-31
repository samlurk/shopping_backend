import { ObjectId } from 'mongodb';

export default class PostModel {
  constructor(
    private readonly title: string,
    private readonly description: string,
    private readonly category = { _id: new ObjectId('642381fe167de3293d9f2c5c') },
    private readonly image = 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80',
    private readonly likes = { active: false },
    private readonly dislikes = { active: false },
    private readonly author = 'admin',
    private readonly numViews = 0,
    private readonly createAt = new Date(),
    private readonly updateAt: Date | 'never' = 'never'
  ) {}
}
