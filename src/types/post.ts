export type Post = {
  id: number;
  title: string;
  content: string;
  createdAt: string;
  postId: number;
  medias: [
    {
      id: number;
      postId: number;
      type: string;
      url: string;
    }
  ];
  user: {
    username: string;
    imageUrl: string;
    clerkId: string;
  };
  likes: [
    {
      id: number;
      userId: string;
      postId: number;
    }
  ];
  comments: [
    {
      id: number;
      userId: string;
      postId: number;
      content: string;
      parentId: number;
    }
  ];
};
