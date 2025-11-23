# Toy Project

>여러 최신 스택들을 활용하여 토이 프로젝트를 구현하였습니다. 
나의 할 일 / 인스타그램 클론 / 넷플릭스 클론 / 파일 업로드 기능을 담고 있으며,
모바일 웹 환경을 고려하여 작업하였습니다.


<br>

### 사용된 기술
`Next.js` `Typescript` `Jotai` `React-query` `Emotion` `Supabase`
- App Router 기반으로 라우팅이 자동화 되어있다는 점과 SSR 및 CSR 을 분리하여 적용할 수 있다는 점, 그리고 API Routes 를 통해 간단한 서버 API 를 바로 생성할 수 있다는 점에서 Next.js 를 사용하게 되었습니다.
- 간단한 중앙데이터 관리를 위해 Recoil 을 사용하려 하였으나, 개발자 지원 중단 및 React 18 버전과의 이슈 등으로 인해 그와 매우 유사한 구조를 가진 Jotai 를 사용하였습니다.
- 데이터 패칭과 인피니트 스크롤링에 있어 가장 최적화된 라이브러리인 React-query 를 사용하였습니다.
- 간단한 CRUD 의 백엔드 환경을 조성하기 위해 supabase 를 활용하였습니다. 
firebase 와 유사하지만 SQL 기반인 점과 그 외 더 좋은 성능으로 디벨롭된 버전이 supabase 라는 점에서 추후 사용 가능성을 염두에 두어 사용하게되었습니다.


<br>

# 1. 인스타그램 클론 (J-Stagram)

>회원가입 및 로그인 구현, 사용자 정보 확인, 회원끼리 실시간 채팅을 할 수 있는 기능을 구현하였습니다. [링크](https://hyejin-toy-project.vercel.app/j-stagram)

<img width="925" height="496" alt="image" src="https://github.com/user-attachments/assets/346fb9e9-ddf8-4a48-af23-91b23299a09c" />


<br>
<br>

## 주요 기능

### 1. 회원가입
  - Supabase Auth 를 활용하여 일반 로그인 및 카카오 소셜 로그인 기능을 구현하였습니다.
  - 일반 회원가입의 경우 이메일로 OTP 번호를 받아 인증하는 방식으로 진행 (** supabase 의 무료 버전이라 이메일 인증 횟수 제한이 있음)
  - `react-hook-form` 과 `zod` 를 사용하여 typescript 에 최적화된 폼 유효성 검증을 구현하였습니다.

  ```
    const signInMutation = useMutation({
    mutationFn: async (formData: z.infer<typeof schema>) => {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (data) {
        console.log(data, '로그인 성공');
      }

      if (error) {
        if (error.message === 'Invalid login credentials') {
          alert('이메일 또는 비밀번호가 올바르지 않습니다.');
        } else {
          alert(error.message);
        }
        throw new Error(error.message);
      }
    },
  });
  ```

  <img width="923" height="491" alt="image" src="https://github.com/user-attachments/assets/f5dae3d0-42fc-4df6-b752-d304327ac7b0" />


  - signInWithOAuth 를 활용한 카카오 소셜 로그인입니다.
 
    
    ```
      const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'kakao',
      options: {
        redirectTo: process.env.NEXT_PUBLIC_VERCEL_URL
          ? `${process.env.NEXT_PUBLIC_VERCEL_URL}api/auth/callback`
          : 'http://localhost:3000/api/auth/callback',
      },
    });
    ```
    
    <img width="734" height="456" alt="image" src="https://github.com/user-attachments/assets/bd90be3f-eade-4aa0-8799-1eec0e11208b" />

  - 아이디, 비밀번호와 함께 비밀번호를 한 번 더 확인하는 유효성 검증을 구현하였습니다.
  
    <img width="364" height="197" alt="image" src="https://github.com/user-attachments/assets/112b590f-0f60-42c8-9cec-2a83c629ede8" />

    <video src="https://github.com/user-attachments/assets/3bf4cee7-6a17-4f96-81cc-65b0ad3cc201" width="400"></video>

    
 <br>
<br>

### 2. 게시글 기능

  - 게시글 CRUD 구현
  - 내 게시글일 경우 홈 피드에서 직접 수정/삭제 가능
  - `react-query` 기반으로 5개 단위 인피니트 스크롤 구현
  - 검색 페이지에서 원하는 키워드로 제목/내용 기반 검색 기능 제공
  - 이미지 업로드의 경우 서버를 거치지 않고 클라이언트가 직접 스토리지로 전송하는 Signed URL 방식을 사용 -> 업로드 성능 및 확장성 개선
 
   <video src="https://github.com/user-attachments/assets/126b67e2-0eab-48dd-a830-f60e70fb0a28" width="400"></video>

  <br>

  ```
  export async function sendMessage({
  message,
  otherUserId,
  }: {
    message: string;
    otherUserId: string;
  }) {
    const supabase = createBrowserSupabaseClient();
  
    const { data, error } = await supabase.from('message').insert({
      message,
      receiver: otherUserId,
    });
  
    if (error) {
      handleError(error);
    }
  
    return data;
  }
    
  const sendMessageMutation = useMutation({
    mutationFn: async () => {
      await sendMessage({ message, otherUserId: selectedChatUserId });
    },
    onSuccess: () => {
      setMessage('');
      getAllMessagesQuery.refetch();
      inputRef.current?.focus();
    },
  });
  ```

<br>
<br>

3. 유저 상세페이지

  - 컨텐츠를 클릭 시 상세 글 모달이 나옴  
  - 상세 글을 모달로 띄우고, 모달에서 수정/삭제 가능
  - 내 프로필 페이지일 경우 바로 글을 작성할 수 있음
  - 상대 프로필 페이지일 경우 바로 메시지를 보낼 수 있음

 <br>
    
  <video src="https://github.com/user-attachments/assets/b656d90b-109b-4e5f-9c7b-936b1da1d92b" width="400"></video>

  ```
  export async function sendMessage({
  message,
  otherUserId,
  }: {
    message: string;
    otherUserId: string;
  }) {
    const supabase = createBrowserSupabaseClient();
  
    const { data, error } = await supabase.from('message').insert({
      message,
      receiver: otherUserId,
    });
  
    if (error) {
      handleError(error);
    }
  
    return data;
  }
    
  const sendMessageMutation = useMutation({
    mutationFn: async () => {
      await sendMessage({ message, otherUserId: selectedChatUserId });
    },
    onSuccess: () => {
      setMessage('');
      getAllMessagesQuery.refetch();
      inputRef.current?.focus();
    },
  });
  ```

<br>
<br>

3. 채팅 기능

  - RealTime 기능을 활용하여 가입된 상대방과 실시간으로 채팅할 수 있도록 구현하였습니다.
  - 직접 회원가입한 지인들과 채팅을 나눠보며, UX 관련 불편했던 부분을 피드백받아 발전시켰습니다.

 <br>
    
  ![Image](https://github.com/user-attachments/assets/c0cefed7-2a1a-44a0-b4f6-b1d26c8a4116)

  ```
  export async function sendMessage({
  message,
  otherUserId,
  }: {
    message: string;
    otherUserId: string;
  }) {
    const supabase = createBrowserSupabaseClient();
  
    const { data, error } = await supabase.from('message').insert({
      message,
      receiver: otherUserId,
    });
  
    if (error) {
      handleError(error);
    }
  
    return data;
  }
    
  const sendMessageMutation = useMutation({
    mutationFn: async () => {
      await sendMessage({ message, otherUserId: selectedChatUserId });
    },
    onSuccess: () => {
      setMessage('');
      getAllMessagesQuery.refetch();
      inputRef.current?.focus();
    },
  });
  ```

- 사용자의 상세 정보를 알 수 있도록 표시하였습니다.

  <br>
  <br>

---

## 2. 나의 할 일(Todo-list)
>가장 기초적인 CRUD 를 구현하기에 적합한 투두리스트를 구현하였습니다. [링크](https://hyejin-toy-project.vercel.app/todo)

<img width="1358" height="619" alt="image" src="https://github.com/user-attachments/assets/90ea9a76-a838-4c69-ae36-729e526d3e33" />

<br>
<br>

### 주요 기능

- 할 일 등록/수정/삭제가 가능하며, 완료 여부를 체크할 수 있도록 구현하였습니다.
- 할 일을 검색하는 기능을 구현하였습니다.
- 이미 체크된 할 일의 경우 아래로 정렬, 할 일 생성일 기준으로 오름차순 정렬 되도록 구현하였습니다.
  
  <img width="1051" height="303" alt="image" src="https://github.com/user-attachments/assets/c9243881-f828-4412-87da-c0c13f8ddd3f" />


  ```
    export async function getTodos({ searchInput = '' }): Promise<TodoRow[]> {
      const supabase = await createServerSupabaseClient();
      const { data, error } = await supabase
        .from('todo')
        .select('*')
        .like('title', `%${searchInput}%`)
        .order('completed', { ascending: true }) // completed false 를 위로, true 를 아래로 정렬
        .order('created_at', { ascending: true }); // 각 그룹 내에서 생성일 기준 오름차순 정렬
    
      if (error) handleError(error);
      return data;
    }
  ```
- 마감일도 있으면 좋겠다는 생각으로 DatePicker 라는 라이브러리를 사용, 따로 다른 페이지에서도 사용하기 유용하게 커스텀 컴포넌트로 제작하였습니다.
  
  <img width="405" height="369" alt="image" src="https://github.com/user-attachments/assets/a2e3fb25-8fb0-41ab-ae57-eb5992f36e5e" />


    ```
    <S.TodoListItemWrapDate>
      <S.TodoListItemWrapText>⏰ 마감일:</S.TodoListItemWrapText>{' '}
      <CustomDatePicker
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        disabled={updateTodoMutation.isPending || !isEdit}
      />
    </S.TodoListItemWrapDate>
    ```
      
    ```
    import DatePicker from 'react-datepicker';
    import 'react-datepicker/dist/react-datepicker.css';
    import * as S from './styled';
    
    interface CustomDatePickerProps {
      selectedDate: Date | null;
      setSelectedDate: (date: Date | null) => void;
      disabled?: boolean;
    }
    
    const CustomDatePicker = ({
      selectedDate,
      setSelectedDate,
      disabled = false,
    }: CustomDatePickerProps) => {
      return (
        <S.DatePickerWrapper $disabled={disabled}>
          <DatePicker
            dateFormat='yyyy.MM.dd'
            shouldCloseOnSelect
            minDate={new Date()}
            selected={selectedDate}
            onChange={(date: Date | null) => setSelectedDate(date)}
            placeholderText='기한 없음'
            disabled={disabled}
          />
        </S.DatePickerWrapper>
      );
    };
    
    export default CustomDatePicker;
    
    ```
- 새로 생성된 할 일인 경우 자동으로 편집 모드가 될 수 있도록 구현하였습니다.
  <img width="1032" height="105" alt="image" src="https://github.com/user-attachments/assets/4eb80f9c-a76f-4574-9081-a4bc2636135c" />

<br>
<br>

---

## 3. 파일 업로드 (Gallery)
>Supabase 의 Storage 기능을 활용해 파일을 업로드 및 삭제할 수 있는 기능을 구현했습니다. [링크](https://hyejin-toy-project.vercel.app/gallery)

<img width="1357" height="764" alt="image" src="https://github.com/user-attachments/assets/a42592d0-3ea5-4902-ba4c-7bad04a3c7e5" />


<br>
<br>

### 주요 기능

- 업로드 창이 열려 이미지를 선택, react-dropzone 를 활용하여 드래그하여 이미지를 업로드하는 기능을 구현하였습니다. (여러 이미지 업로드 가능)

  <img width="745" height="454" alt="image" src="https://github.com/user-attachments/assets/a76e324a-2d29-464a-a09d-325115ce3763" />

```
  const handleUpload = async (formData: FormData) => {
    const res = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || 'Upload failed');
    return result.data;
  };

```
    
- 이미지 호버시 업로드된 이미지를 삭제할 수 있습니다.

  <img width="235" height="286" alt="image" src="https://github.com/user-attachments/assets/9cfff327-3d65-40f9-887a-c6d489cb1313" />

  
- 이미지 이름을 검색하는 기능을 구현하였습니다.
  - 파일 이름이 인식안되는 이슈가 있어 이미지가 업로드될 때 파일명이 한글일 경우 변환 후 타임스탬프를 추가하였습니다.

    ```
      const toSafeFileName = (name: string) => {
      const ext = name.includes('.') ? '.' + name.split('.').pop() : '';
      const base = name.replace(/\.[^/.]+$/, '');
      // 파일명이 이미 안전한 형식인지 체크
      if (/^[a-zA-Z0-9-_]+$/.test(base)) {
        return name;
      }
      const safeBase = base.replace(/[^a-zA-Z0-9-_]/g, '_');
      const timestamp = Date.now();
      return `${safeBase}_${timestamp}${ext}`;
    };
    ```

<br>
<br>

---


## 4. 넷플릭스 클론
>영화를 검색할 수 있는 넷플릭스 클론 사이트를 구현하였습니다. [링크](https://hyejin-toy-project.vercel.app/movie)

<img width="1453" height="722" alt="image" src="https://github.com/user-attachments/assets/cbce361f-18da-4a9a-9798-4949b2577d02" />



<br>
<br>

### 주요 기능

- React-Query 의 useInfiniteQuery 와 useInView 를 활용하여, 스크롤이 밑에 다다르면 추가적으로 영화 목록이 생기도록 인피니트 스크롤을 구현하였습니다.

  ```
    const movieSearch = useAtomValue(movieSearchState);

    const { data, fetchNextPage, hasNextPage, isFetching, isFetchingNextPage } = useInfiniteQuery({
      initialPageParam: 1,
      queryKey: ['movie', movieSearch],
      queryFn: ({ pageParam }) => searchMovies(movieSearch, pageParam, 12),
      getNextPageParam: (lastPage) => {
        return lastPage.page ? lastPage.page + 1 : null;
      },
    });
  
    const { ref, inView } = useInView({
      threshold: 0,
    });
  
    useEffect(() => {
      if (inView && hasNextPage && !isFetchingNextPage && !isFetching) {
        fetchNextPage();
      }
    }, [inView, hasNextPage, fetchNextPage]);
  ```

  <img width="1197" height="662" alt="image" src="https://github.com/user-attachments/assets/db0bb4a5-f21f-439f-87ce-a8d3a5a4090a" />

  
    
- 동적 라우팅을 활용하여 영화 상세페이지를 구현하였습니다.

  <img width="693" height="475" alt="image" src="https://github.com/user-attachments/assets/3ee65df2-820d-42df-8739-eb2ff9c13234" />


  <img width="1253" height="666" alt="image" src="https://github.com/user-attachments/assets/a4a09a71-c744-4831-86a4-5dc3d37b6211" />


  
- 영화를 제목으로 검색할 수 있도록 구현하였습니다.

<br>
<br>

## 문제 해결 및 성능 개선

1. 나의 할 일
   - 등록/수정/삭제가 되는 동안 버튼을 누르면 중복 요청이 발생되어, 요청이 완료되지 않을 시 버튼 기능 disabled 처리 (+로딩중 로띠를 활용하여 UX 처리)
   - 완료된 할 일과 미완료된 할 일이 뒤섞인 부분을 supabase 정렬기능으로 분리하여 가독성을 높임

2. 인스타그램 클론
   - 실시간 onlineAt 데이터를 받아 현재 유저가 접속 상태인지에 대한 정보를 초록점으로 표시하여 사용자 경험 개선
   - 새로운 채팅이 발생할 때마다 맨 아래로 스크롤 되도록 인터랙션 구현
   
4. 파일 업로드
   - 서버액션에서 실행한 Form Data 형식의 데이터 요청에 이슈가 생겨 API Router 를 통해 클라이언트 요청하여 해결
   - 파일이 업로드되는 동안 클릭 및 드래그 기능을 막아 중복 요청을 방지
   - 파일명이 한글일 경우 파일 인식이 안되는 이슈를 위해 정규표현식을 활용하여 파일명 변환
  
<br>
<br>

## 추후 개선시키고 싶은 사항

- 나의 할 일 리스트의 갯수가 많아질 시 pagination 이 될 수 있도록 개선
- 나의 할 일 작성 후 버튼만이 아닌 엔터키를 쳐도 등록/수정이 되도록 개선
- J-stagram 의 유저를 검색할 수 있는 기능으로 개선
- J-stagram 의 채팅창에서 채팅 옆에 보낸 시간이 표시되도록 개선 (사용자 피드백)
- 파일 삭제시 일괄 선택으로 여러 파일을 삭제할 수 있도록 기능 개선
- 넷플릭스 클론에서 인피니트 스크롤이 동작 시 로딩 액션이 뜰 수 있도록 개선

<br>
<br>

---

## 프로젝트 의의

이제껏 백엔드에서 내려주는 API 를 연동하여 다루는 작업만 해오다가, 간단하지만 직접 백엔드 환경을 만들어 CRUD 작업까지 풀스택으로 구현해본 경험이 굉장히 매력적으로 다가왔습니다. 장기적으로 보았을 때 풀스택개발자까지 생각을 하는 입장으로써 좋은 경험이었다고 생각합니다. Next.js 환경에서 서버컴포넌트, Image, API 라우터 등 내장된 기능들을 더 적극적으로 활용한 부분이 인상깊었으며 버전 이슈로 Recoil 을 대체하여 Jotai 등 라이브러리를 사용해보면서 빠르게 바뀌는 프론트엔드 기술에 익숙해져야겠다고 느꼈습니다. 파일 업로드가 안되는 이슈를 해결하거나, 사용자 경험에서 불편한 점을 직접 느껴보면서 개선을 해보는 등 많은 보람을 느꼈습니다. 이외에도 정적으로 데이터를 받아오는 것이 아닌, 실시간으로 서버에서 생성된 채팅 기록을 가져오는 부분이나 일반 및 소셜 회원가입/로그인 인증기능까지 개발해보면서 더 폭넓은 프론트엔드 영역을 경험했습니다. 추후에 어떠한 서비스를 맡게되든 더 유동적으로 대응하기 위해서는 다양한 환경에서의 경험이 필요하며, 이번 토이프로젝트를 통해 그러한 영역에서 한걸음 성장했다는 생각이 들었습니다.
