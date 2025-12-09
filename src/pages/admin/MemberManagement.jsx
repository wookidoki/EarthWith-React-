import React, { useState } from "react";
import axios from "axios";
import ErrorModal from "./ErrorModal";
import { validationRules } from "../../components/common/ValidationRules";

const regions = [
  "서울", "부산", "대구", "인천", "광주", "대전", "울산", "세종",
  "경기", "강원", "충북", "충남", "전북", "전남", "경북", "경남", "제주",
];

export default function MemberManagement() {
  const [keyword, setKeyword] = useState("");
  const [member, setMember] = useState(null);
  const [editField, setEditField] = useState(null);
  const [inputValue, setInputValue] = useState("");

  // 🔥 ErrorModal 상태 추가
  const [errorInfo, setErrorInfo] = useState({
    visible: false,
    message: "",
  });

  const accessToken = localStorage.getItem("accessToken");

  /** ===========================
   * 회원 검색
   * =========================== */
  const handleSearch = async (searchKey) => {
    const finalKeyword = searchKey || keyword;

    if (!finalKeyword.trim()) {
      setErrorInfo({
        visible: true,
        message: "검색할 회원 ID를 입력하세요.",
      });
      return;
    }

    try {
      const res = await axios.get("http://localhost:8081/admin/members", {
        params: { keyword: finalKeyword },
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      setMember(res.data);
      setEditField(null);
      setInputValue("");
      setKeyword(finalKeyword);

    } catch (e) {
      const failMessage = searchKey
        ? `ID 변경은 완료되었으나 새 ID(${searchKey})로 조회에 실패했습니다.`
        : "회원 조회에 실패했습니다.";

      setErrorInfo({
        visible: true,
        message: e.response?.data?.message || failMessage,
      });

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
   * 회원 정보 수정 요청 (공통)
   * =========================== */
  const requestUpdate = async (body, endpoint, updatedId = null) => {
    try {
      const response = await axios.put(
        `http://localhost:8081/admin/members/${endpoint}`,
        body,
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );

      if (response.data?.success && response.data?.member) {
        setMember(response.data.member);
      }

      // 🔥 성공 메시지도 모달로 보여주기 원하면 아래 활성화
      // setErrorInfo({ visible: true, message: "수정이 완료되었습니다." });

      // 변경값 재조회
      if (updatedId) {
        await handleSearch(updatedId);
      } else {
        await handleSearch();
      }

    } catch (e) {
      setErrorInfo({
        visible: true,
        message: e.response?.data?.message || "수정에 실패했습니다.",
      });
    }
  };

  // 변경할 회원정보에 대한 검증
  const validateField = () => {
    const rules = validationRules;

    const value = inputValue.trim();

    switch (editField) {
      case "id":
        const idRule = rules.newId;
        if (!idRule.regex.test(value) || value.length < idRule.min || value.length > idRule.max) {
          return idRule.message;
        }
        break;

      case "name":
        const nameRule = rules.newName;
        if (!nameRule.regex.test(value) || value.length < nameRule.min || value.length > nameRule.max) {
          return nameRule.message;
        }
        break;

      case "region":
        const regionRule = rules.newRegion;
        if (!regionRule.regex.test(value) || value.length < regionRule.min || value.length > regionRule.max) {
          return regionRule.message;
        }
        break;

      case "phone":
        const phoneRule = rules.newPhone;
        if (!phoneRule.regex.test(value)) {
          return phoneRule.message;
        }
        break;

      case "email":
        const emailRule = rules.newEmail;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
          return emailRule.message;
        }
        break;

      case "point":
        const pointRule = rules.newPoint;
        if (isNaN(value) || Number(value) < 0) {
          return pointRule.message;
        }
        break;

      default:
        return null;
    }

    return null;
  };


  /** ===========================
   * 수정 제출
   * =========================== */
  const handleSubmit = () => {
    if (!member) return;

      const errorMsg = validateField();
      if (errorMsg) {
        setErrorInfo({ visible: true, message: errorMsg });
        return;
      }

    const no = member.memberNo;
    let body = null;
    let endpoint = "";

    switch (editField) {
      case "id":
        body = { memberNo: no, newId: inputValue };
        endpoint = "id";
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
    <>
      {/* 🔥 ErrorModal */}
      <ErrorModal
        visible={errorInfo.visible}
        message={errorInfo.message}
        onClose={() => setErrorInfo({ visible: false, message: "" })}
      />

      <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 space-y-4">
        <h2 className="text-xl font-bold">회원 정보 관리</h2>

        {/* 검색 */}
        <div className="flex gap-3">
          <input
            className="border p-2 rounded-lg flex-1 focus:outline-none"
            placeholder="회원 ID로 검색"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSearch();
            }}
          />
          <button
            onClick={() => handleSearch()}
            className="bg-emerald-600 text-white px-4 py-2 rounded-lg"
          >
            검색
          </button>
        </div>

        {/* 검색 결과 */}
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

            {/* 수정 영역 */}
            {editField && (
              <div className="mt-4 p-5 rounded-xl bg-white border border-gray-200 shadow-md space-y-4">

                <h3 className="font-semibold text-lg text-gray-800 flex items-center gap-2">
                  <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                  {
                    editField === "id" ? "아이디" :
                      editField === "name" ? "이름" :
                        editField === "email" ? "이메일" :
                          editField === "phone" ? "연락처" :
                            editField === "point" ? "포인트" :
                              editField === "region" ? "지역" :
                                editField === "role" ? "권한" :
                                  editField === "status" ? "상태" : editField
                  }{" "}
                  수정
                </h3>

                {editField === "region" ? (
                  <select
                    className="border p-3 rounded-xl w-full bg-gray-50 focus:outline-none"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                  >
                    {regions.map((r) => (
                      <option key={r} value={r}>{r}</option>
                    ))}
                  </select>
                ) : editField === "role" || editField === "status" ? (
                  <div className="text-gray-700 bg-gray-50 p-3 rounded-xl border">
                    현재 : {editField === "role" ? getRoleLabel(member.role) : getStatusLabel(member.status)}
                    <br />
                    아래 버튼 클릭 시 {editField === "role" ? "권한이" : "상태가"} 변경됩니다.
                  </div>
                ) : (
                  <input
                    className="border p-3 rounded-xl w-full bg-gray-50 focus:outline-none"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                  />
                )}

                <div className="flex gap-3 pt-2">
                  <button
                    className="bg-emerald-600 text-white px-4 py-2.5 rounded-xl hover:bg-emerald-700 transition-all"
                    onClick={handleSubmit}
                  >
                    변경
                  </button>

                  <button
                    className="bg-gray-200 text-gray-700 px-4 py-2.5 rounded-xl hover:bg-gray-300 transition-all"
                    onClick={() => {
                      setEditField(null);
                      setInputValue("");
                    }}
                  >
                    취소
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}
