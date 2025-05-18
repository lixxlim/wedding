const apiUrl = "https://api.lixlim.com/wedding/guestbook";
const guestbookArea = document.getElementById('sk_snsbbs');

// 방명록 리스트 가져오기
async function fetchGuestbook(page = 0, size = 10, sort = "createdDatetimeUtc,desc") { // size와 sort 파라미터 추가
    try {
        const response = await fetch(`${apiUrl}?page=${page}&size=${size}&sort=${sort}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const pageData = await response.json(); // Spring Page 객체 전체를 받음

        // renderGuestbook 함수에 Page 객체의 content와 필요한 페이징 정보를 전달
        if (pageData && pageData.page) { // pageData와 pageData.page 객체가 모두 존재하는지 확인
            renderGuestbook(pageData.content, pageData.page.totalPages, pageData.page.number);
        } else {
            console.error("Error: Page data structure is not as expected. 'page' object or its properties are missing.", pageData);
            // 예외 처리 또는 기본값으로 렌더링 (예: 페이지네이션 없이 목록만)
            renderGuestbook(pageData.content, 1, 0); // 예시: 페이지네이션 없이 첫 페이지만 표시
        }

    } catch (error) {
        console.error("방명록 데이터를 가져오는 중 오류 발생:", error);
        const listContainer = document.getElementById("guestbook-list");
        listContainer.innerHTML = `<p style="color: red;">데이터를 불러오는데 실패했습니다. 잠시 후 다시 시도해주세요.</p>`;
    }
}

// 방명록 리스트 렌더링
function renderGuestbook(guestbookEntries, totalPages, currentPageNumber) { // 파라미터명 변경 및 currentPageNumber는 0-based
    const listContainer = document.getElementById("guestbook-list");
    const paginationContainer = document.getElementById("guestbook-pagination");
    listContainer.innerHTML = "";
    if (paginationContainer) {
        paginationContainer.innerHTML = "";
    } else {
        console.error("Error: Pagination container not found!");
    }

    if (!guestbookEntries || guestbookEntries.length === 0) {
        listContainer.innerHTML = "<p>작성된 방명록이 없습니다.</p>";
        return;
    }

    guestbookEntries.forEach(entry => {
        const entryDiv = document.createElement("div");
        entryDiv.className = "msg_wrap";
        const formattedDate = entry.createdDatetimeUtc ? new Date(entry.createdDatetimeUtc).toLocaleString() : 'N/A';
        entryDiv.innerHTML = `
            <div class="gb_header">
                <div class="gb_meta">
                    <strong>${entry.userName}</strong>
                    <span class="gb_date">(${formattedDate})</span>
                </div>
                <button class="delete-btn" data-id="${entry.guestbookId}">삭제하기</button>
            </div>
            <div class="gb_msg">
                ${entry.text}
            </div>
        `;
        listContainer.appendChild(entryDiv);
    });

    // 페이지네이션 버튼 생성
    if (paginationContainer && totalPages > 1) {
        const maxPageButtons = 5; // 한 번에 표시할 최대 페이지 버튼 수
        let startPage, endPage;

        if (totalPages <= maxPageButtons) {
            // 전체 페이지 수가 최대 표시 버튼 수보다 작거나 같으면 모든 페이지 표시
            startPage = 0;
            endPage = totalPages -1; // 0-based index이므로 totalPages - 1
        } else {
            // 전체 페이지 수가 최대 표시 버튼 수보다 많을 경우
            // 현재 페이지를 중심으로 버튼들을 표시하도록 계산
            let maxPagesBeforeCurrentPage = Math.floor(maxPageButtons / 2);
            let maxPagesAfterCurrentPage = Math.ceil(maxPageButtons / 2) - 1;

            if (currentPageNumber <= maxPagesBeforeCurrentPage) {
                // 현재 페이지가 시작 부분에 가까울 때 (예: 0, 1, 2)
                startPage = 0;
                endPage = maxPageButtons - 1;
            } else if (currentPageNumber + maxPagesAfterCurrentPage >= totalPages -1) {
                // 현재 페이지가 끝 부분에 가까울 때
                startPage = totalPages - maxPageButtons;
                endPage = totalPages - 1;
            } else {
                // 현재 페이지가 중간 부분에 있을 때
                startPage = currentPageNumber - maxPagesBeforeCurrentPage;
                endPage = currentPageNumber + maxPagesAfterCurrentPage;
            }
        }
        // startPage는 최소 0, endPage는 최대 totalPages - 1을 넘지 않도록 보정
        startPage = Math.max(0, startPage);
        endPage = Math.min(totalPages - 1, endPage);


        // "맨 처음" 버튼 (선택적)
        if (startPage > 0) {
            const firstPageBtn = document.createElement("button");
            firstPageBtn.textContent = "<<";
            firstPageBtn.addEventListener("click", () => {
                fetchGuestbook(0);
                guestbookArea.scrollIntoView();
            });
            paginationContainer.appendChild(firstPageBtn);
        }

        // "이전 그룹" 또는 "이전 페이지" 버튼
        if (currentPageNumber > 0) {
            const prevBtn = document.createElement("button");
            prevBtn.textContent = "<";
            prevBtn.addEventListener("click", () => {
                fetchGuestbook(currentPageNumber - 1);
                guestbookArea.scrollIntoView();
            });
            paginationContainer.appendChild(prevBtn);
        }

        // 페이지 번호 버튼
        for (let i = startPage; i <= endPage; i++) {
            const pageBtn = document.createElement("button");
            pageBtn.textContent = i + 1;
            pageBtn.className = i === currentPageNumber ? "active" : "";
            pageBtn.addEventListener("click", () => {
                if (i !== currentPageNumber) {
                    fetchGuestbook(i);
                    guestbookArea.scrollIntoView();
                }
            });
            paginationContainer.appendChild(pageBtn);
        }

        // "다음 그룹" 또는 "다음 페이지" 버튼
        if (currentPageNumber < totalPages - 1) {
            const nextBtn = document.createElement("button");
            nextBtn.textContent = ">";
            nextBtn.addEventListener("click", () => {
                fetchGuestbook(currentPageNumber + 1);
                guestbookArea.scrollIntoView();
            });
            paginationContainer.appendChild(nextBtn);
        }

        // "맨 끝" 버튼 (선택적)
        if (endPage < totalPages - 1) {
            const lastPageBtn = document.createElement("button");
            lastPageBtn.textContent = ">>";
            lastPageBtn.title = "마지막 페이지로";
            lastPageBtn.addEventListener("click", () => {
                fetchGuestbook(totalPages - 1);
                guestbookArea.scrollIntoView();
            });
            paginationContainer.appendChild(lastPageBtn);
        }

    } else if (paginationContainer) {
        console.log("Not rendering pagination buttons because totalPages =", totalPages);
    }
}

// 초기 데이터 로드 (예: 0번째 페이지, 10개씩, 기본 정렬)
document.addEventListener('DOMContentLoaded', () => {
    fetchGuestbook(); // 기본값으로 첫 페이지 로드
});

// 방명록 등록
async function addGuestbook() {
    // HTML input 요소의 ID가 GuestbookReqDto 필드명과 일치하도록 변경 또는 맞춰줌
    const userNameInput = document.getElementById("guestbook-userName"); // ID 변경 예시
    const textInput = document.getElementById("guestbook-text");       // ID 변경 예시
    const deleteKeyInput = document.getElementById("guestbook-deleteKey"); // ID 변경 예시

    const userName = userNameInput.value.trim();
    const text = textInput.value.trim();
    const deleteKey = deleteKeyInput.value.trim();

    // 간단한 클라이언트 측 유효성 검사 (선택 사항이지만 권장)
    if (!userName || !text || !deleteKey) {
        alert("모든 필드를 입력해주세요.");
        return;
    }

    const guestbookData = {
        userName: userName, // DTO 필드명과 일치
        text: text,         // DTO 필드명과 일치
        deleteKey: deleteKey  // DTO 필드명과 일치
    };

    try {
        const response = await fetch(apiUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                // CSRF 토큰이 필요한 경우 여기에 추가 (예: Spring Security CSRF 보호 사용 시)
                // "X-CSRF-TOKEN": getCsrfToken() // 가상의 함수
            },
            body: JSON.stringify(guestbookData),
        });

        if (response.ok) { // HTTP 상태 코드가 200-299 범위일 때
            const createdGuestbook = await response.json(); // 성공 시 등록된 방명록 데이터

            fetchGuestbook(); // 목록 새로고침 (현재 페이지로 할지, 첫 페이지로 할지 결정 필요)
            toggleGuestbookForm(false); // 폼 숨김 처리
            guestbookArea.scrollIntoView(); // 방명록 목록으로 스크롤

            // 폼 초기화
            if (userNameInput) userNameInput.value = "";
            if (textInput) textInput.value = "";
            if (deleteKeyInput) deleteKeyInput.value = "";

        } else { // HTTP 상태 코드가 오류 범위일 때 (예: 400, 500)
            const errorData = await response.json(); // 오류 응답 본문 (JSON 형태라고 가정)
            console.error("방명록 등록 실패:", errorData);

            if (response.status === 400 && errorData.errors) {
                // 서버 측 유효성 검사 오류 처리
                let errorMessages = "입력 값 오류:\n";
                errorData.errors.forEach(err => {
                    errorMessages += `- ${err.field}: ${err.message}\n`;
                });
                alert(errorMessages);
            } else {
                // 기타 서버 오류
                alert(`방명록 등록에 실패했습니다. (상태 코드: ${response.status})`);
            }
        }
    } catch (error) { // 네트워크 오류 등 fetch 자체의 실패
        console.error("방명록 등록 중 네트워크 또는 기타 오류 발생:", error);
        alert("방명록을 등록하는 중 오류가 발생했습니다. 네트워크 연결을 확인해주세요.");
    }
}

// 폼 제출 이벤트에 addGuestbook 함수 연결
const guestbookForm = document.getElementById("guestbook-form");
if (guestbookForm) {
    guestbookForm.addEventListener("submit", function(event) {
        event.preventDefault();
        addGuestbook();

        // 폼 제출 후 방명록 목록으로 스크롤
        guestbookArea.scrollIntoView();
    });
}

// 방명록 삭제
async function deleteGuestbook(guestbookId) { // 파라미터명을 guestbookId로 명확히 함
    const deleteKey = prompt("방명록 삭제를 위한 패스워드를 입력하세요:");

    if (deleteKey === null) { // 사용자가 '취소'를 누르거나 Esc 키를 누른 경우
        console.log("삭제가 취소되었습니다.");
        return;
    }

    if (!deleteKey.trim()) { // 빈 문자열을 입력한 경우
        alert("패스워드를 입력해야 합니다.");
        return;
    }

    try {
        // API URL 구성:  BASE_URL/{guestbookId}?deleteKey=사용자가입력한값
        const deleteApiUrl = `${apiUrl}/${guestbookId}?deleteKey=${encodeURIComponent(deleteKey)}`;
        console.log("Requesting DELETE to:", deleteApiUrl); // 요청 URL 확인용 로그

        const response = await fetch(deleteApiUrl, {
            method: "DELETE",
            headers: {
                // "Content-Type"은 DELETE 요청 시 본문이 없다면 필수는 아님.
                // 필요한 다른 헤더가 있다면 여기에 추가 (예: 인증 토큰)
            }
            // body는 보내지 않음 (서버 API가 @RequestParam으로 받으므로)
        });

        if (response.ok) { // HTTP 상태 코드가 200-299 범위 (성공적인 삭제는 보통 204 No Content)
            alert("방명록이 성공적으로 삭제되었습니다.");
            fetchGuestbook(); // 목록 새로고침
            guestbookArea.scrollIntoView(); // 방명록 목록으로 스크롤
        } else if (response.status === 401) { // HttpStatus.UNAUTHORIZED (삭제키 불일치)
            alert("패스워드가 일치하지 않습니다. 다시 시도해주세요.");
        } else if (response.status === 404) { // HttpStatus.NOT_FOUND (존재하지 않는 아이디)
            alert("삭제할 방명록을 찾을 수 없습니다.");
        } else if (response.status === 400) { // HttpStatus.BAD_REQUEST (ID 형식 오류 등)
            alert("잘못된 요청입니다. ID 값을 확인해주세요.");
        } else {
            // 기타 서버 오류 (500 등)
            // 서버에서 에러 메시지를 본문에 담아 보냈다면 파싱 시도 가능
            let errorMessage = `방명록 삭제에 실패했습니다. (상태 코드: ${response.status})`;
            try {
                const errorData = await response.json(); // 또는 response.text()
                if (errorData && errorData.message) { // 서버 응답 형식에 따라 조정
                    errorMessage += `\n서버 메시지: ${errorData.message}`;
                } else if (typeof errorData === 'string' && errorData.trim() !== '') {
                    errorMessage += `\n서버 메시지: ${errorData}`;
                }
            } catch (e) {
                // JSON 파싱 실패 등
                console.warn("Error response body could not be parsed as JSON.", e);
            }
            alert(errorMessage);
            console.error("방명록 삭제 실패:", response.status, await response.text()); // 응답 본문 텍스트로 확인
        }
    } catch (error) { // 네트워크 오류 등 fetch 자체의 실패
        console.error("방명록 삭제 중 네트워크 또는 기타 오류 발생:", error);
        alert("방명록 삭제 중 오류가 발생했습니다. 네트워크 연결을 확인해주세요.");
    }
}

// 입력 폼 토글
function toggleGuestbookForm(show) {
    const form = document.getElementById("guestbook-form");
    form.style.display = show ? "block" : "none";
}

// 이벤트 리스너 등록
document.getElementById("guestbook-add-btn").addEventListener("click", () => toggleGuestbookForm(true));
document.getElementById("guestbook-cancel").addEventListener("click", () => toggleGuestbookForm(false));
document.getElementById("guestbook-list").addEventListener("click", event => {
    if (event.target.classList.contains("delete-btn")) {
        const id = event.target.getAttribute("data-id");
        deleteGuestbook(id);
    }
});

// 초기 데이터 로드
fetchGuestbook();