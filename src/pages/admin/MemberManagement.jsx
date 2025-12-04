import React, { useState } from "react";
import axios from "axios";

const regions = [
  "서울", "부산", "대구", "인천", "광주", "대전", "울산", "세종",
  "경기", "강원", "충북", "충남", "전북", "전남", "경북", "경남", "제주",
];

export default function MemberManagement() {
  const [keyword, setKeyword] = useState("");
  const [member, setMember] = useState(null);
  const [editField, setEditField] = useState(null);
  const [inputValue, setInputValue] = useState("");

  const accessToken = localStorage.getItem("accessToken");

  /** ===========================
   * 회원 검색 (검색할 키워드를 인자로 받을 수 있도록 수정)
   * =========================== */
  const handleSearch = async (searchKey) => {
    // searchKey가 있으면 그것을 사용하고, 없으면 state의 keyword를 사용
    const finalKeyword = searchKey || keyword;

    if (!finalKeyword.trim()) {
      alert("검색할 회원 ID를 입력하세요.");
      return;
    }
    
    try {
      const res = await axios.get("http://localhost:8081/admin/members", {
        params: { keyword: finalKeyword }, // finalKeyword 사용
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      setMember(res.data);
      setEditField(null);
      setInputValue("");
      // 💡 성공적으로 검색된 키워드를 state에 반영 (ID 변경 재조회 시 중요)
      setKeyword(finalKeyword); 

    } catch (e) {
      console.error("회원 조회 실패", e);
      // 💡 ID 변경 재조회 실패 시에는 메시지를 다르게 표시할 수도 있습니다.
      const failMessage = searchKey 
        ? `ID 변경은 완료되었으나, 새 ID(${searchKey})로 조회에 실패했습니다.` 
        : "회원 조회에 실패했습니다.";
      
      alert(e.response?.data?.message || failMessage);
      setMember(null);
    }
  };

  const getRoleLabel = (role) => (role === "ROLE_ADMIN" ? "관리자" : "일반회원");
  const getStatusLabel = (status) =>
    status === "Y" ? (
      <span className="text-green-600 font-bold">활동</span>
    ) : (
      <span className="text-red-600 font-bold">정지</span>
    );

  /** ===========================
   * 회원 정보 수정 공통 처리 (재조회 로직 수정)
   * =========================== */
  const requestUpdate = async (body, endpoint, updatedId = null) => {
    try {
      const response = await axios.put(
        `http://localhost:8081/admin/members/${endpoint}`,
        body,
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );

      /** 🟢 백엔드에서 success + member 데이터를 내려주는 경우 사용 */
      if (response.data?.success && response.data?.member) {
        setMember(response.data.member);
      }

      alert("수정 완료되었습니다.");

      /** 변경된 정보 재조회 */
      if (updatedId) {
        // 💡 ID가 변경된 경우, 새로운 ID로 재조회 요청
        await handleSearch(updatedId); 
      } else {
        // 💡 그 외 필드는 기존 키워드로 재조회 요청
        await handleSearch();
      }
      
      // ⚠️ setKeyword(updatedId) 및 await handleSearch(); 로직이
      // 이전에 오류를 유발했으므로 제거하고 위의 로직으로 대체합니다.

    } catch (e) {
      console.error("수정 요청 실패", e);
      alert(e.response?.data?.message || "수정에 실패했습니다.");
    }
  };

  /** ===========================
   * 수정 요청 처리
   * =========================== */
  const handleSubmit = () => {
    if (!member) return;

    const no = member.memberNo;
    let body = null;
    let endpoint = "";

    switch (editField) {
      case "id":
        body = { memberNo: no, newId: inputValue };
        endpoint = "id";
        // 아이디 변경 시, requestUpdate에서 updatedId(inputValue)를 전달
        return requestUpdate(body, endpoint, inputValue); 

      case "name":
        body = { memberNo: no, newName: inputValue };
        endpoint = "name";
        break;

      case "email":
        body = { memberNo: no, newEmail: inputValue };
        endpoint = "email";
        break;

      case "phone":
        body = { memberNo: no, newPhone: inputValue };
        endpoint = "phone";
        break;

      case "point":
        body = { memberNo: no, newPoint: inputValue };
        endpoint = "point";
        break;

      case "region":
        body = { memberNo: no, newRegion: inputValue };
        endpoint = "region";
        break;

      case "role":
        body = {
          memberNo: no,
          newRole: member.role === "ROLE_ADMIN" ? "ROLE_USER" : "ROLE_ADMIN",
        };
        endpoint = "role";
        break;

      case "status":
        body = {
          memberNo: no,
          newStatus: member.status === "Y" ? "N" : "Y",
        };
        endpoint = "status";
        break;

      default:
        return;
    }

    requestUpdate(body, endpoint);
  };

  const openEditor = (field, currentValue) => {
    setEditField(field);
    setInputValue(currentValue || "");
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 space-y-4">
      <h2 className="text-xl font-bold">회원 정보 관리</h2>

      {/* ======================== 검색 영역 ======================== */}
      <div className="flex gap-3">
        <input
          className="border p-2 rounded-lg flex-1"
          placeholder="회원 ID로 검색"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSearch();
          }}
        />
        <button
          onClick={() => handleSearch()} // 인자 없이 호출하여 keyword state 사용
          className="bg-emerald-600 text-white px-4 py-2 rounded-lg"
        >
          검색
        </button>
      </div>

      {/* ======================== 검색 결과 ======================== */}
      {!member ? (
        <div className="text-gray-500 mt-4">검색된 회원이 없습니다.</div>
      ) : (
        <>
          <table className="w-full mt-4 border border-gray-300">
            <thead>
              <tr className="bg-gray-100 border-b border-gray-300">
                <th className="p-2">회원번호</th>
                <th className="p-2">ID</th>
                <th className="p-2">이름</th>
                <th className="p-2">이메일</th>
                <th className="p-2">연락처</th>
                <th className="p-2">포인트</th>
                <th className="p-2">지역</th>
                <th className="p-2">권한</th>
                <th className="p-2">상태</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-gray-200">
                <td className="p-2 text-center">{member.memberNo}</td>
                <td className="p-2 text-center cursor-pointer text-blue-600"
                    onClick={() => openEditor("id", member.memberId)}>
                  {member.memberId}
                </td>
                <td className="p-2 text-center cursor-pointer text-blue-600"
                    onClick={() => openEditor("name", member.memberName)}>
                  {member.memberName}
                </td>
                <td className="p-2 text-center cursor-pointer text-blue-600"
                    onClick={() => openEditor("email", member.email)}>
                  {member.email}
                </td>
                <td className="p-2 text-center cursor-pointer text-blue-600"
                    onClick={() => openEditor("phone", member.phone)}>
                  {member.phone}
                </td>
                <td className="p-2 text-center cursor-pointer text-blue-600"
                    onClick={() => openEditor("point", member.memberPoint)}>
                  {member.memberPoint}
                </td>
                <td className="p-2 text-center cursor-pointer text-blue-600"
                    onClick={() => openEditor("region", member.regionName)}>
                  {member.regionName}
                </td>
                <td className="p-2 text-center cursor-pointer text-blue-600"
                    onClick={() => openEditor("role")}>
                  {getRoleLabel(member.role)}
                </td>
                <td className="p-2 text-center cursor-pointer text-blue-600"
                    onClick={() => openEditor("status")}>
                  {getStatusLabel(member.status)}
                </td>
              </tr>
            </tbody>
          </table>

          <div className="flex gap-3 mt-4">
            변경을 원하는 회원정보를 선택하시면 정보를 변경하실 수 있습니다.
          </div>

          {/* ======================== 수정 영역 ======================== */}
          {editField && (
            <div className="mt-4 p-4 border rounded-lg bg-gray-50 space-y-3">
              <h3 className="font-semibold">
                {
                  editField === "id" ? "아이디" : 
                  editField === "name" ? "이름" : 
                  editField === "email" ? "이메일" : 
                  editField === "phone" ? "연락처" : 
                  editField === "point" ? "포인트" : 
                  editField === "region" ? "지역" : 
                  editField === "role" ? "권한" : 
                  editField === "status" ? "상태" : 
                  editField
                } 수정
              </h3>

              {editField === "region" ? (
                <select
                  className="border p-2 rounded-lg w-full"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                >
                  {regions.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
              ) : editField === "role" || editField === "status" ? (
                <div className="text-gray-700">
                  현재 값: {editField === "role" ? getRoleLabel(member.role) : getStatusLabel(member.status)}
                  <br/>
                  아래 버튼 클릭 시 {editField === "role" ? "권한이" : "상태가"} 변경됩니다.
                </div>
              ) : (
                <input
                  className="border p-2 rounded-lg w-full"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleSubmit();
                  }}
                />
              )}

              <button
                className="bg-blue-600 text-white px-4 py-2 rounded-lg"
                onClick={handleSubmit}
              >
                변경
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}