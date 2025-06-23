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
