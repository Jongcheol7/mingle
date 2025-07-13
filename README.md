Mingle 소셜웹 프로젝트는 Next.js 기반으로 만들었습니다.
UI 디자인은 tailwind 와 shadcn/ui 를 기본으로 사용하였습니다.
데이터베이스는 postgresql 을 사용하였고 prisma 어댑터를 통해 접근하였습니다.
postgresql 은 최종적으로 supabase 에서 관리할거지만 개발 단계에서는 로컬에서 dbever를 통해 관리합니다.

tailwind는 next 패키지 설치시 자동으로 설치되며 shadcn/ui만 따로 설치하면 된다.
shadcn 에서 주로 Button, Sidebar, Slide 등을 사용하였다.

prisma를 사용하려면 prisma, @prisma/client를 설치해야한다.
설치후 lib/prisma.ts 파일을 만든후 prisma 변수가 node 전역객체에 정의되어있지 않으면 새로 생성한다.
prisma를 정상적으로 설치하면 prisma/schema.prisma파일이 생성되며 generater client,
datasource db설정. 여기서 db는 privider 속성을 postgresql 사용할거고, url은 환경변수에 저장된
DATABASE URL을 사용할거다. 이는 DBeaver에서 신규생성하고나서 속성에서 주소 볼수 있다.
해당 schema.prisma 파일에서 테이블들을 model링 하게된다. 서로의 모델과의 관계를 지정해줘야한다.
User - Post 간 1:N 관계라면 User 안에 posts Post[]로 지정하고
Post안에 user User @relation(fields:[userId], references:[clerkId])
모델을 작성하고 npx prisma migrate 실행해서 DBeaver에 반영되었는지 확인.

인증은 Clerk을 사용하고 있다. clerk 관련 패키지를 설치하고 middleware.ts 파일이 생성되는데
여기서 auth.protect로 특정한 경로를 url로 접근한다면 clerk인증을 거치도록하기 위함이다.
Clerk을 사용하려면 최상위 RootLayout에 <ClerkProvider>로 감싼다.

페이지 구조
app 디렉토리 하위에 라우팅 그룹을 사용해 /auth, /home, /post 등 기능별로 그룹화했습니다.
루트 경로 /는 (home) 그룹 하위에 위치합니다.
/에 접근 시, Clerk 세션에서 로그인된 사용자 정보(user)를 가져옵니다.
-> const {userId} = await auth();
해당 user 정보를 기반으로, 데이터베이스에서 유저 데이터를 직접 조회합니다.
클라이언트에서는 React Query와 Axios를 사용해 데이터를 요청합니다 (fetch 대신 axios 사용).
데이터 요청이 성공하면, Zustand를 통해 상태를 관리합니다.

## Next 프로젝트 설치

## Clerk 인증 구현

## Shadcn/ui 로 사이드바 구현

## postgresql 연결

## Clerk 회원가입시 postgresql에 데이터 insert

## ngrok 사용법

npx ngrok http 3000 (매번실행후 clerk webhook 의 endpoint 수정) 후 url 을 clerk의 webhook 주소로 넣자.
ngrok 터널로 외부에서 내 local 서버에 접근 가능하도록 설정하고,
반환받은 URL을 Clerk Webhook의 Endpoint로 등록하면,
Clerk에서 웹훅 이벤트가 발생할 때 해당 경로의 POST 메서드가 실행된다.

Clerk 이벤트 발생시 (회원가입) 기 설정된 파일인 app/api/users/webhook 에 설정된 POST 호출해
내부에 설정했던 prisma를 통해 postgresql 에 데이터 insert 하게된다.

그 전에 postgresql 에 작성했던 스키마를 migrate 해줘야 하는데
/prisma/schema.prisma 에 모델을 설정해두고 npx prisma migrate dev --name init 실행.
model 명은 첫글자 대문자 권고. 이후에 prisma 는 소문자로 접근가능

## 로그인이나 회원가입시 / 로 리다이렉트

리다이렉트시 Root Page 에서 react-query를 통해 api 라우트를 호출한다.
라우트에서 Clerk의 세션을 통해 id를 가져온 후 db의 where 조건으로 넘기고 데이터를 가져온다.
여기서 reactquery v5에서는 onSuccess, onError 를 더이상 지원하지 않아서 바깥에서 useEffect을 통해
(src\hooks\useLoginUser.ts 참고) isSuccess 인지 isError 인지를 판단해 zustand 상태 업데이트 한다.

문제: Clerk 의 UserButton 컴포넌트로 Management Account 버튼 클릭시 창이 모달로 열리는데
닉네임같은걸 수정하고 모달을 닫을시 Root Page 이 랜더링이 되지 않아서 zustand 에 변경된 db 데이터가
반영되지 않는다. 따라서 userProfileMode="navigation" userProfileUrl="/profile" 처럼 모달에서 네비게이션으로 변경후
경로를 profile 로 지정함. 또 여기서 page.tsx 를 app/profile 하위에 두자니 catch-all 라우트로 반드시 해야한다는 에러로
app/profile/[[...profile]] 경로에 두었다. 별도의 Link 와 Button(shadcn) 으로 "/" 로 이동 하도록해서
db user 최신 상태를 가져오도록 한다.

## 사진이나 영상 업로드 화면 구성

기본적으로 app 하위 폴더는 페이지 전용으로 각 page.tsx 에서는 화면이나 레이아웃을 구성할 컴포넌트를 렌더링한다.
나는 modules/post/ui 하위에 화면을 구성할 파일들을 넣어두었다.
shadcd 기반으로 설정해놨다. 그리고 파일을 드래그 해서 업로드 할수 있도록 "npm i react-dropzone" 패키지 설치후 적용했다.
파일을 넣는순간 해당 파일이 image 인지 video 인지 판단한다. 단 파일은 해당 페이지에서는 1개만 업로드 할수 있음.
image 파일이라면 <ImageUpload> 컴포넌트 호출, video 파일이라면 <VideoUpload> 컴포넌트 호출

<ImageUpload> 컴포넌트 : "npm i react-easy-crop" 설치를 하여 사진을 쉽게 크기조정 가능하도록 한다.
그리고 밝기,채도,대비,흐리게,주변어둡게를 shadcn의 Slider 컴포넌트를 활용. 조정시마다 각각 상태를 즉각 반영하고
Cropper 를 감싸는 div 태그의 style로 세팅해준다.
슬라이더 우측상단에 초기값 버튼을 만들어 클릭시 초기값으로 재세팅.

문제: 초기에 파일 하나만 넘어왔기 때문에 여기서 사진파일을 추가로 넣을수 있어야 한다.
나는 인스타그램처럼 +버튼을 만들고 클릭시 사진리스트와 추가할수 있는 버튼을 보이고 싶고, 사진들은 드래그로
순서도 변경 가능해야한다. 따라서 아래 패키기를 추가해준다.
npm install embla-carousel-react
npm install @dnd-kit/core @dnd-kit/sortable @dnd-kit/modifiers
embla-carousel-react : 좌우 슬라이드 기능 제공, 모바일 터치도 지원
@dnd-kit/core : 드래그 드롭 기능. 어디떨어졌는지 계산(onDragEnd, collisionDetection)
@dnd-kit/sortable : 여러 요소를 드래그로 정렬 할수 있게 해줌.

## alert => sonner 패키지 사용.

RootLayou에 Toaster를 import해주고 컴포넌트를 선언해야 사용가능하다.
toast.error(""), toast.success("")

## form을 useForm 을 활용해서 사용.

npm i react-hook-form 설치

## 이미지 저장은 aws의 s3를 통해서 해보자.

aws 프리티어 가입후 s3 서비스에서 버킷을 생성한다. 생성후 권한과 정책을 변경후
발급받은 AWS_ACCESS_KEY_ID 와 AWS_SECRET_ACCESS_KEY 를 환경변수에 저장한후
/app/api/post/upload/image/route.ts에서 소스구현.
필요패키지는 아래와 같다.
npm install @aws-sdk/client-s3 @aws-sdk/s3-request-presigner
순서는 사진+글(form) 저장시 s3에서 presignedUrl을 받아온다.
배열에 담아두고 form안에 배열을 추가적으로 넣은후 api 라우트 호출.
요금절약을 위해 사진파일을 압축해야겠다..
npm install browser-image-compression 을 설치해서 적용해보자.
추가적으로 클라우드는 조회를 하는데도 과금이 발생한다고 한다.
포스트가 많을때 스크롤을 내릴때마다 s3에서 이미지를 받는다면 과금문제가 심각할수 있다..
그래서 aws cloudfront 서비스를 사용하도록 한다. 해당 서비스에 들어가서 배포를 하고나면
알아서 s3 정책이 수정이 된다. 배포완료되면 받는 CLOUDFRONT_DOMAIN_NAME 는 또 환경변수에 담아두자.

앞으로 흘러가는 사진 프로세스 방향.
s3에 presignedUrl요청 요청후 uploadUrl과 fileUrl을 따로 관리한다.
여기서 핵심은 fileUrl에는 CLOUDFRONT_DOMAIN_NAME를 뭍히면 된다.
즉 사진은 uploadUrl에 한번만 저장하면되는거고 db에는 fileUrl을 저장하게 된다.
그리고 앞으로 사진에 접근할때는 fileUrl을 사용해서 cloudfront에 접근하면
cloudfront는 s3에 접근해서 파일을 보여주게 되는 꼴이다.

## 무한스크롤

postlist 조회시 무한스크롤로 구현하려고 한다. 대부분 소셜미디어에서도 그렇게 하고있는거 같다.
방식에는 skip/limit 방식과 cursor 방식이 있는데 큰규모 프로젝트에는 cursor 가 좋은게
중간에 post가 삭제되더라도 마지막 데이터 ID를 기준으로 다음 데이터를 불러오기 때문에 누락이 없다.
skip/limit은 처음 조회할때 스냅샷을 한거같은 느낌이랄까. 그래서 10개를 조회하는데 중간에 삭제되면
10개를 조회하지 못한다.
화면 컴포넌트에서 리엑트쿼리(/hooks/usePostLists.ts)를 호출후 useInfiniteQuery 의 queryFn 에서
/app/api/post/list/route.ts 호출하도록 한다.
조회쿼리에는 여러 테이블을 join하게되는데 일대다 관계를 조인하면 1개의 포스트지만 여러 row를 리턴하는데
prisma의 include 기능으로 여러개의 출력을 하나의 컬럼에 배열로 반환해준다. 이래서 prisma를 쓰는건가 싶다.

## 슬라이드 기능을 구현해보자

npm install swiper 패키지 설치.
src\modules\home\ui\PostLists.tsx 소스에서 Swiper, SwiperSlide 컴포넌트를 통해 슬라이더를 구현한다.
참고로 <, > 화살표가 자동으로 생성될텐데 크기를 조정하려고 globalcss 를 수정하였다.

## 비디오 기능 Mux

Mux는 비디오 전용 클라우드겸 플레이어 기능도 제공해준다.
npm install @mux/mux-node 설치를 하고
플레이어를 위해 npm install @mux/mux-player-react 도 설치해준다.
그리고 mux 홈페이지 가입후 Access Tokens을 발급받고 환경변수에 저장해둔다.
aws s3와 마찬가지로 업로드전 presigned url 을 발급받고 나중에 업로드 할때
해당 url을 사용하게된다.
src\app\api\post\upload\video\route.ts 참고

동영상 자르기를 위해 ffmpeg.wasm 패키지를 다운받는다. 이 라이브러리는 인기가 많고
사용 예시도 많아서 채택해보도록 하겠다.
npm install @ffmpeg/ffmpeg @ffmpeg/util

## 채팅기능

별도의 채팅을 위한 서버를 만들고 구축하였다.
npx tsx index.ts 로 서버를 실행시킨다..
