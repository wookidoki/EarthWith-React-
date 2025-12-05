import React, { useState } from 'react';
import { User, Lock, Bell, AlertTriangle } from 'lucide-react';

const AccountSettings = ({ currentUser }) => {
  const [activeSection, setActiveSection] = useState('profile'); // profile, security, notifications, danger
  
  // 프로필 수정
  const [nickname, setNickname] = useState(currentUser?.memberName || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [phone, setPhone] = useState(currentUser?.phone || '');
  
  // 비밀번호 변경
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // 알림 설정
  const [notifications, setNotifications] = useState({
    comment: true,
    like: true,
    follow: false,
    event: true
  });

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    
    try {
      const memberNo = localStorage.getItem('memberNo');
      const response = await fetch(`http://localhost:8081/members/${memberNo}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          memberName: nickname,
          email: email,
          phone: phone
        })
      });

      if (response.ok) {
        alert('프로필이 수정되었습니다.');
      }
    } catch (error) {
      console.error('프로필 수정 실패:', error);
      alert('프로필 수정에 실패했습니다.');
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      alert('새 비밀번호가 일치하지 않습니다.');
      return;
    }

    try {
      const memberNo = localStorage.getItem('memberNo');
      const response = await fetch(`http://localhost:8081/members/${memberNo}/password`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          currentPassword: currentPassword,
          newPassword: newPassword
        })
      });

      if (response.ok) {
        alert('비밀번호가 변경되었습니다.');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      }
    } catch (error) {
      console.error('비밀번호 변경 실패:', error);
      alert('비밀번호 변경에 실패했습니다.');
    }
  };

  const handleNotificationChange = async (key) => {
    const updated = {
      ...notifications,
      [key]: !notifications[key]
    };
    setNotifications(updated);

    try {
      const memberNo = localStorage.getItem('memberNo');
      await fetch(`http://localhost:8081/members/${memberNo}/notifications`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(updated)
      });
    } catch (error) {
      console.error('알림 설정 실패:', error);
    }
  };

  const handleAccountDelete = async () => {
    if (!window.confirm('정말로 계정을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.')) {
      return;
    }

    try {
      const memberNo = localStorage.getItem('memberNo');
      const response = await fetch(`http://localhost:8081/members/${memberNo}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        alert('계정이 삭제되었습니다.');
        localStorage.clear();
        window.location.href = '/';
      }
    } catch (error) {
      console.error('계정 삭제 실패:', error);
      alert('계정 삭제에 실패했습니다.');
    }
  };

  const menuItems = [
    { id: 'profile', icon: User, label: '프로필 정보', color: 'emerald' },
    { id: 'security', icon: Lock, label: '보안 설정', color: 'blue' },
    { id: 'danger', icon: AlertTriangle, label: '계정 관리', color: 'red' }
  ];

  return (
    <div className="space-y-6">
      {/* 설정 메뉴 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeSection === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center space-y-2 ${
                isActive
                  ? `bg-${item.color}-50 border-${item.color}-500 shadow-md`
                  : 'bg-white border-gray-200 hover:border-gray-300 hover:shadow-sm'
              }`}>
              <Icon className={`w-6 h-6 ${isActive ? `text-${item.color}-600` : 'text-gray-400'}`} />
              <span className={`text-sm font-medium text-center ${
                isActive ? `text-${item.color}-700` : 'text-gray-600'
              }`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* 설정 내용 */}
      <div className="border-t border-gray-100 pt-6">
        
        {/* 프로필 정보 */}
        {activeSection === 'profile' && (
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">프로필 정보</h3>
            <form onSubmit={handleProfileUpdate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">닉네임</label>
                <input 
                  type="text" 
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  placeholder="닉네임을 입력하세요"
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">이메일</label>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="이메일을 입력하세요"
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">전화번호</label>
                <input 
                  type="tel" 
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="전화번호를 입력하세요"
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                />
              </div>
              <button 
                type="submit" 
                className="w-full md:w-auto px-6 py-2.5 bg-emerald-500 text-white rounded-lg font-medium hover:bg-emerald-600 transition-all shadow-sm">
                저장하기
              </button>
            </form>
          </div>
        )}

        {/* 보안 설정 */}
        {activeSection === 'security' && (
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">비밀번호 변경</h3>
            <form onSubmit={handlePasswordChange} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">현재 비밀번호</label>
                <input 
                  type="password" 
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="현재 비밀번호를 입력하세요"
                  required
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">새 비밀번호</label>
                <input 
                  type="password" 
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="새 비밀번호를 입력하세요"
                  required
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">새 비밀번호 확인</label>
                <input 
                  type="password" 
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="새 비밀번호를 다시 입력하세요"
                  required
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                />
              </div>
              <button 
                type="submit" 
                className="w-full md:w-auto px-6 py-2.5 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-all shadow-sm">
                비밀번호 변경
              </button>
            </form>
          </div>
        )}


        {/* 계정 관리 */}
        {activeSection === 'danger' && (
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">계정 관리</h3>
            <div className="border-2 border-red-200 rounded-xl p-6 bg-red-50">
              <div className="flex items-start space-x-4">
                <AlertTriangle className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
                <div className="flex-1">
                  <h4 className="font-semibold text-red-900 mb-2">계정 삭제</h4>
                  <p className="text-sm text-red-700 mb-4">
                    계정을 삭제하면 모든 데이터가 영구적으로 삭제됩니다. 이 작업은 되돌릴 수 없습니다.
                  </p>
                  <button 
                    onClick={handleAccountDelete}
                    className="px-6 py-2.5 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-all shadow-sm">
                    계정 삭제
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AccountSettings;