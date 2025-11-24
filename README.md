# 서비스에 대하여

>여러 최신 스택들을 활용하여 토이 프로젝트를 구현하였습니다. 
나의 할 일 / 넷플릭스 클론 / 파일 업로드 기능들을 바탕으로 J-Stagram 이라는 sns 서비스를 최종적으로 산출해냈으며,
모든 작업을 반응형으로 작업하였습니다.

<img width="1163" height="791" alt="Image" src="https://github.com/user-attachments/assets/3ace9289-b170-45b2-9bcc-6936a9ac2b9b" />

<img width="1162" height="792" alt="Image" src="https://github.com/user-attachments/assets/ad5a57ad-8455-4575-9f38-7134f6ef7cf0" />

<!-- <img width="1393" height="480" alt="Image" src="https://github.com/user-attachments/assets/eb6f837c-8d62-4b90-83e6-0ae83d301d27" /> -->
<br>

### 사용된 기술
`Next.js` `Typescript` `Jotai` `React-query` `Emotion` `Supabase`
- App Router 기반으로 라우팅이 자동화 되어있다는 점과 SSR 및 CSR 을 분리하여 적용할 수 있다는 점, 그리고 API Routes 를 통해 간단한 서버 API 를 바로 생성할 수 있다는 점에서 Next.js 를 사용하게 되었습니다.
- 간단한 중앙데이터 관리를 위해 Recoil 을 사용하려 하였으나, 개발자 지원 중단 및 React 18 버전과의 이슈 등으로 인해 그와 매우 유사한 구조를 가진 Jotai 를 사용하였습니다.
- 데이터 패칭과 인피니트 스크롤링에 있어 가장 최적화된 라이브러리인 React-query 를 사용하였습니다.
- 간단한 CRUD 의 백엔드 환경을 조성하기 위해 supabase 를 활용하였습니다. 
firebase 와 유사하지만 SQL 기반인 점과 그 외 더 좋은 성능으로 디벨롭된 버전이 supabase 라는 점에서 추후 사용 가능성을 염두에 두어 사용하게되었습니다.


<br>

# J-Stagram

> J-Stagram 은 인스타그램을 참고한 sns 서비스로, 반응형 웹으로 제작되었습니다. 
회원가입 및 로그인 구현, 게시글 CRUD, 유저 상세페이지 기능, 회원끼리 실시간 채팅을 할 수 있는 기능을 구현하였습니다. [링크](https://hyejin-toy-project.vercel.app/j-stagram)

<img width="1140" height="639" alt="Image" src="https://github.com/user-attachments/assets/2eeac920-966e-4de2-abd2-e131194f6f08" />


<br>
<br>

## 주요 기능

### 1. 회원가입
  - Supabase Auth 를 활용하여 일반 로그인 및 카카오 소셜 로그인 기능을 구현
  - 일반 회원가입의 경우 이메일로 OTP 번호를 받아 인증하는 방식으로 진행 (** supabase 의 무료 버전이라 이메일 인증 횟수 제한이 있음)
  - `react-hook-form` 과 `zod` 를 사용하여 typescript 에 최적화된 폼 유효성 검증을 구현

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

  <img width="923" height="491" alt="Image" src="https://github.com/user-attachments/assets/8c61ded0-dead-4330-bd14-96a17f5cc3de" />


  - signInWithOAuth 를 활용한 카카오 소셜 로그인
 
    
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
    
    <img width="734" height="456" alt="Image" src="https://github.com/user-attachments/assets/4584073f-471b-4057-9655-8a61ed71d20e" />

  - 아이디, 비밀번호와 함께 비밀번호를 한 번 더 확인하는 유효성 검증을 구현
  
    <img width="364" height="197" alt="Image" src="https://github.com/user-attachments/assets/374fd62e-d19b-4dfa-9bdd-5408fce72ae1" />

    <video src="https://github.com/user-attachments/assets/3bf4cee7-6a17-4f96-81cc-65b0ad3cc201" width="400"></video>

    
 <br>
<br>

### 2. 게시글 기능

  - 게시글 CRUD 구현
  - 홈 피드에서 내 게시글일 경우 홈 피드에서 직접 수정/삭제 가능
  - `react-query` 기반으로 5개 단위 인피니트 스크롤 구현
  - 이미지 업로드의 경우 서버를 거치지 않고 클라이언트가 직접 스토리지로 전송하는 Signed URL 방식을 사용 -> 업로드 성능 및 확장성 개선
 
   <video src="https://github.com/user-attachments/assets/126b67e2-0eab-48dd-a830-f60e70fb0a28" width="400"></video>
  <br>
  
  📄 PostForm.tsx

  ```
...
import { createPost, createPostImages } from 'actions/postsActions';
const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

...
// Signed URL 방식으로 파일 업로드 (Supabase Direct Upload)
  const handleUpload = async (files: File[]): Promise<Array<{ path: string }>> => {
    const uploadResults: Array<{ path: string }> = [];

    for (const file of files) {
      try {
        if (!file) throw new Error('파일이 없습니다.');

        // 1) 서버에서 signed URL 요청
        const signRes = await fetch('/api/upload', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            fileName: file.name,
            fileType: file.type,
          }),
        });

        // 응답이 JSON인지 확인
        const contentType = signRes.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          const text = await signRes.text();
          throw new Error(`서버 응답 오류 (상태: ${signRes.status}): ${text.substring(0, 100)}`);
        }

        let signData;
        try {
          signData = await signRes.json();
        } catch {
          const text = await signRes.text();
          throw new Error(`JSON 파싱 실패: ${text.substring(0, 100)}`);
        }

        if (!signRes.ok) {
          throw new Error(signData.error || 'Signed URL 발급 실패');
        }

        if (!signData.signedUrl || !signData.path) {
          throw new Error('Signed URL 또는 경로가 없습니다.');
        }

        // 2) signed URL로 직접 Supabase에 업로드
        const uploadRes = await fetch(signData.signedUrl, {
          method: 'PUT',
          headers: {
            'Content-Type': file.type,
          },
          body: file,
        });

        if (!uploadRes.ok) {
          throw new Error(`Supabase 업로드 실패: ${uploadRes.statusText}`);
        }

        uploadResults.push({ path: signData.path });
      } catch (err) {
        throw new Error(
          err instanceof Error ? `업로드 실패 (${file.name}): ${err.message}` : '업로드 실패',
        );
      }
    }

    return uploadResults;
  };

  const createPostMutation = useMutation({
    mutationFn: async (formData: z.infer<typeof schema>) => {
      let imageUrls: string[] = [];

      // 파일이 선택된 경우 업로드
      if (selectedFiles.length > 0) {
        setIsUploading(true);
        try {
          const uploadResults = await handleUpload(selectedFiles);
          imageUrls = uploadResults
            .map((result) => {
              if (result.path) {
                return getImageUrl(result.path);
              }
              return null;
            })
            .filter((url: string | null) => url !== null);
        } catch (err) {
          throw new Error((err as Error).message);
        } finally {
          setIsUploading(false);
        }
      }

      // 게시글 생성
      const newPost = await createPost({
        title: formData.title,
        content: formData.postInput,
        is_public: true,
        user_id: myInfo.id,
      });

      // 이미지가 있으면 images 테이블에 추가
      if (imageUrls.length > 0 && newPost.id) {
        await createPostImages(newPost.id, imageUrls);
      }

      return newPost;
    },
    onSuccess: (newPost) => {
      setIsUploading(false); // 업로드 상태 초기화
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      queryClient.invalidateQueries({ queryKey: ['userPosts'] });
      reset();
      
      thumbnailUrls.forEach((url) => URL.revokeObjectURL(url));
      setSelectedFiles([]);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      
      if (newPost?.id) {
        onSuccess?.(newPost.id);
      }
    },
    onError: (error: Error) => {
      setIsUploading(false);
      // 업로드 실패 시 썸네일 URL 해제 및 상태 롤백
      thumbnailUrls.forEach((url) => URL.revokeObjectURL(url));
      setSelectedFiles([]);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      alert(error.message);
    },
    onSettled: () => {
      onPendingChange?.(false);
    },
  });
...
  ```
<br>

  - 검색 페이지에서 원하는 키워드로 제목/내용 기반 검색 기능 제공
  <br>
  <video src="https://github.com/user-attachments/assets/18b69d6c-0e4e-4b56-9814-854ac8fa958d" width="400"></video>
   <br>

### 3. 유저 프로필 상세페이지

  - 컨텐츠 클릭 시 상세 글 모달 표시
  - 모달에서 바로 게시글 수정/삭제 가능
  - 내 프로필일 경우 바로 새 글 작성 가능
  - 다른 유저 프로필일 경우 메시지 전송 기능 제공

 <br>
    
  <video src="https://github.com/user-attachments/assets/b656d90b-109b-4e5f-9c7b-936b1da1d92b" width="400"></video>
   <br>
  
  📄 UserPage.tsx

  ```
const [isModalOpen, setIsModalOpen] = useState(false);
const [selectedPostId, setSelectedPostId] = useState<number | null>(null);

...
// 모달에서 선택된 게시글 데이터 가져오기
  const { data: selectedPost, isLoading: isLoadingSelectedPost } = useQuery({
    queryKey: ['post', selectedPostId],
    queryFn: () => (selectedPostId ? getPostById(selectedPostId) : null),
    enabled: !!selectedPostId && isModalOpen,
    refetchOnWindowFocus: false,
  });


  const handlePostCreated = (postId?: number) => {
    if (postId) {
      setSelectedPostId(postId); // 모달 내용을 상세 게시글로 변경
      queryClient.invalidateQueries({ queryKey: ['userPosts', user.id] });
    }
  };

  const handlePostUpdated = async () => {
    queryClient.invalidateQueries({ queryKey: ['userPosts', user.id] });
    if (selectedPostId) {
      queryClient.invalidateQueries({ queryKey: ['post', selectedPostId] });
    }
  };
...
  ```

<br>
<br>

### 4. 채팅 기능

  - RealTime 기능을 활용하여 가입된 상대방과 실시간으로 채팅할 수 있도록 구현
  - 직접 회원가입한 실제 지인들과 채팅을 나눠보며, UX 관련 불편했던 부분을 피드백받아 발전

 <br>
    
  ![Image](https://github.com/user-attachments/assets/f47ea7ec-d764-4e29-b151-2f77573a229b)

  📄 MessageScreen.tsx
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

- 사용자의 상세 정보를 알 수 있도록 표시

  <br>
  <br>

---

# Side Project

## 2. 나의 할 일(Todo-list)
>가장 기초적인 CRUD 를 구현하기에 적합한 투두리스트를 구현 [링크](https://hyejin-toy-project.vercel.app/todo)

<img width="1358" height="619" alt="Image" src="https://github.com/user-attachments/assets/3a01e1cf-925e-42fc-b86a-4ee870cff519" />

<br>
<br>

### 주요 기능

- 할 일 등록/수정/삭제가 가능하며, 완료 여부를 체크할 수 있도록 구현
- 할 일을 검색하는 기능을 구현
- 이미 체크된 할 일의 경우 아래로 정렬, 할 일 생성일 기준으로 오름차순 정렬 되도록 구현
  
  <img width="1051" height="303" alt="Image" src="https://github.com/user-attachments/assets/14b15da5-e0a2-46d7-8eae-c38766043ca6" />


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
- 마감일도 있으면 좋겠다는 생각으로 DatePicker 라는 라이브러리를 사용, 따로 다른 페이지에서도 사용하기 유용하게 커스텀 컴포넌트로 제작
  
  <img width="405" height="369" alt="Image" src="https://github.com/user-attachments/assets/97435936-758f-4488-a3e3-00a357e98a34" />


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
- 새로 생성된 할 일인 경우 자동으로 편집 모드가 될 수 있도록 구현
  <img width="1032" height="105" alt="Image" src="https://github.com/user-attachments/assets/8537856d-b753-4e75-816c-be49247622ec" />

<br>
<br>

---

## 3. 파일 업로드 (Gallery)
>Supabase 의 Storage 기능을 활용해 파일을 업로드 및 삭제할 수 있는 기능 구현 [링크](https://hyejin-toy-project.vercel.app/gallery)

<img width="1357" height="764" alt="Image" src="https://github.com/user-attachments/assets/a322896e-0721-4622-9962-12e0d49fd064" />


<br>
<br>

### 주요 기능

- 업로드 창이 열려 이미지를 선택, react-dropzone 를 활용하여 드래그하여 이미지를 업로드하는 기능을 구현 (여러 이미지 업로드 가능)

  <img width="745" height="454" alt="Image" src="https://github.com/user-attachments/assets/57449a0f-66c2-4bb3-9c4e-3718a96b1f9d" />

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
    
- 이미지 호버시 업로드된 이미지 삭제 가능

  <img width="235" height="286" alt="Image" src="https://github.com/user-attachments/assets/f83d5875-0266-4b81-b4a5-fdf8b550c095" />

  
- 이미지 이름을 검색하는 기능을 구현
  - 파일 이름이 인식안되는 이슈가 있어 이미지가 업로드될 때 파일명이 한글일 경우 변환 후 타임스탬프를 추가

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
>영화를 검색할 수 있는 넷플릭스 클론 사이트를 구현 [링크](https://hyejin-toy-project.vercel.app/movie)

<img width="1453" height="722" alt="Image" src="https://github.com/user-attachments/assets/0b112f46-ade0-4680-b1b6-9c109b1cfb02" />



<br>
<br>

### 주요 기능

- `react-query` 의 `useInfiniteQuery` 와 `useInView` 를 활용하여, 스크롤이 밑에 다다르면 추가적으로 영화 목록이 생기도록 인피니트 스크롤을 구현

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

  <img width="1197" height="662" alt="Image" src="https://github.com/user-attachments/assets/3f4f5d97-6022-4edc-8c0d-21ca6f72ca1a" />

  
    
- 동적 라우팅을 활용하여 영화 상세페이지를 구현하였습니다.

  <img width="693" height="475" alt="Image" src="https://github.com/user-attachments/assets/fcea6063-95b0-40c2-899a-152a2bbebace" />


  <img width="1253" height="666" alt="Image" src="https://github.com/user-attachments/assets/a687d434-96f2-4f00-a979-809aa0e233d9" />


  
- 영화를 제목으로 검색할 수 있도록 구현하였습니다.

<br>
<br>

## 문제 해결 및 성능 개선

1. 나의 할 일
   - 등록/수정/삭제가 되는 동안 버튼을 누르면 중복 요청이 발생되어, 요청이 완료되지 않을 시 버튼 기능 disabled 처리 (+로딩중 로띠를 활용하여 UX 처리)
   - 완료된 할 일과 미완료된 할 일이 뒤섞인 부분을 supabase 정렬기능으로 분리하여 가독성을 높임

2. j-stagram (인스타그램 클론)
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
- J-stagram 의 채팅방에서 이미지를 전송할 수 있도록 개선
- 파일 삭제시 일괄 선택으로 여러 파일을 삭제할 수 있도록 기능 개선
- 넷플릭스 클론에서 인피니트 스크롤이 동작 시 로딩 액션이 뜰 수 있도록 개선

<br>
<br>

---

## 프로젝트 의의

이제껏 백엔드에서 내려주는 API 를 연동하여 다루는 작업만 해오다가, 간단하지만 직접 백엔드 환경을 만들어 CRUD 작업까지 풀스택으로 구현해본 경험이 굉장히 매력적으로 다가왔습니다. 장기적으로 보았을 때 풀스택개발자까지 생각을 하는 입장으로써 좋은 경험이었다고 생각합니다. Next.js 환경에서 서버컴포넌트, Image, API 라우터 등 내장된 기능들을 더 적극적으로 활용한 부분이 인상깊었으며 버전 이슈로 Recoil 을 대체하여 Jotai 등 라이브러리를 사용해보면서 빠르게 바뀌는 프론트엔드 기술에 익숙해져야겠다고 느꼈습니다. 파일 업로드가 안되는 이슈를 해결하거나, 사용자 경험에서 불편한 점을 직접 느껴보면서 개선을 해보는 등 많은 보람을 느꼈습니다. 이외에도 정적으로 데이터를 받아오는 것이 아닌, 실시간으로 서버에서 생성된 채팅 기록을 가져오는 부분이나 일반 및 소셜 회원가입/로그인 인증기능까지 개발해보면서 더 폭넓은 프론트엔드 영역을 경험했습니다. 추후에 어떠한 서비스를 맡게되든 더 유동적으로 대응하기 위해서는 다양한 환경에서의 경험이 필요하며, 이번 토이프로젝트를 통해 그러한 영역에서 한걸음 성장했다는 생각이 들었습니다.
