import React, { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User, LogOut, Coins, Calendar, Camera } from 'lucide-react';

const ProfileHeader = ({ user, stats, setUser }) => { // ⭐ setUser props 필요
  const navigate = useNavigate();
  const { logout } = useAuth();
  const fileInputRef = useRef(null);
  const [imageUrl, setImageUrl] = useState(null);

  // user.memberImage가 변경될 때마다 imageUrl 업데이트
  useEffect(() => {
    console.log('👤 user.memberImage 변경:', user?.memberImage);
    
    if (user?.memberImage) {
      const fullUrl = getImageUrl(user.memberImage);
      console.log('🖼️ 새 이미지 URL:', fullUrl);
      setImageUrl(fullUrl);
    } else {
      setImageUrl(null);
    }
  }, [user?.memberImage]); // ⭐ user.memberImage 변경 감지

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleProfileEdit = () => {
    navigate('/profile/edit');
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('이미지 파일만 업로드 가능합니다.');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('파일 크기는 5MB 이하여야 합니다.');
      return;
    }

    console.log('📤 이미지 업로드 시작:', file.name);

    try {
      const formData = new FormData();
      formData.append('newImage', file);
      formData.append('memberId', localStorage.getItem('memberId'));
      
      if (user?.memberImage) {
        formData.append('imagePath', user.memberImage);
      }

      const token = localStorage.getItem('accessToken');
      const response = await fetch('http://localhost:8081/members/profile', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      console.log('📥 응답 상태:', response.status);

      if (response.ok) {
        // ⭐ 서버에서 새 경로 받기 (JSON으로 변경한 경우)
        // const result = await response.json();
        // const newImagePath = result.imagePath;
        
        // ⭐ 또는 타임스탬프로 경로 생성 (현재 방식)
        const timestamp = Date.now();
        const extension = file.name.substring(file.name.lastIndexOf('.'));
        const newImagePath = `/upload/${timestamp}${extension}`;
        
        console.log('✅ 새 이미지 경로:', newImagePath);
        
        // ⭐ 1. localStorage 업데이트
        localStorage.setItem('memberImage', newImagePath);
        console.log('✅ localStorage 업데이트 완료');
        
        // ⭐ 2. React state 즉시 업데이트 (가장 중요!)
        if (setUser) {
          setUser(prevUser => {
            const updatedUser = {
              ...prevUser,
              memberImage: newImagePath
            };
            console.log('✅ user state 업데이트:', updatedUser);
            return updatedUser;
          });
        } else {
          console.error('❌ setUser가 없습니다! MyProfilePage에서 전달했는지 확인하세요.');
        }
        
        // ⭐ 3. 로컬 이미지 URL도 즉시 업데이트
        setImageUrl(getImageUrl(newImagePath));
        
        alert('프로필 이미지가 변경되었습니다.');
        
      } else {
        const errorText = await response.text();
        console.error('❌ 업로드 실패:', errorText);
        alert(`업로드 실패: ${errorText}`);
      }
    } catch (error) {
      console.error('❌ 네트워크 오류:', error);
      alert('업로드 중 오류가 발생했습니다.');
    }
  };

  const getImageUrl = (imagePath) => {
    if (!imagePath) return null;
    
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
      return imagePath;
    }
    
    return `http://localhost:8081${imagePath}`;
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
      <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8">
        
        {/* 프로필 사진 */}
        <div className="relative group">
          <div className="w-32 h-32 rounded-full bg-gradient-to-br from-emerald-100 to-green-200 flex items-center justify-center border-4 border-white shadow-md overflow-hidden">
            {imageUrl ? (
              <img 
                src={imageUrl}
                alt="프로필" 
                className="w-full h-full object-cover"
                key={imageUrl} // ⭐ key로 강제 리렌더링
                onLoad={() => {
                  console.log('✅ 이미지 로드 성공:', imageUrl);
                }}
                onError={(e) => {
                  console.error('❌ 이미지 로드 실패:', imageUrl);
                  e.target.style.display = 'none';
                }}
              />
            ) : (
              <User className="w-16 h-16 text-emerald-600" />
            )}
          </div>
          
          <div 
            onClick={handleImageClick}
            className="absolute inset-0 rounded-full bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100 cursor-pointer">
            <div className="text-center">
              <Camera className="w-8 h-8 text-white mx-auto mb-1" />
              <span className="text-white text-xs font-medium">사진 변경</span>
            </div>
          </div>
          
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
          />
        </div>

        {/* 프로필 정보 */}
        <div className="flex-1 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start space-x-2 mb-2">
            <h2 className="text-3xl font-bold text-gray-900">
              {user?.memberName || '사용자'}
            </h2>
            <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm font-medium">
              🌱 새싹
            </span>
          </div>
          
          <p className="text-gray-500 mb-1">{user?.email || 'email@example.com'}</p>
          
          <div className="flex items-center justify-center md:justify-start space-x-4 text-sm text-gray-600 mb-4">
            <span className="flex items-center space-x-1">
              <Coins className="w-4 h-4 text-amber-500" />
              <span className="font-semibold text-amber-600">
                {user?.memberPoint || 0}P
              </span>
            </span>
            <span className="text-gray-300">|</span>
            <span className="flex items-center space-x-1">
              <Calendar className="w-4 h-4" />
              <span>가입일: {user?.enrollDate || '2024.01.15'}</span>
            </span>
          </div>

          <div className="flex items-center justify-center md:justify-start space-x-6 pt-4 border-t border-gray-100">
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">{stats.posts}</p>
              <p className="text-xs text-gray-500">작성글</p>
            </div>
            <div className="w-px h-10 bg-gray-200"></div>
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">{stats.comments}</p>
              <p className="text-xs text-gray-500">댓글</p>
            </div>
            <div className="w-px h-10 bg-gray-200"></div>
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">{stats.likes}</p>
              <p className="text-xs text-gray-500">좋아요</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col space-y-2">
          <button 
            onClick={handleProfileEdit}
            className="px-6 py-2.5 bg-emerald-500 text-white rounded-lg font-medium hover:bg-emerald-600 transition-all shadow-sm">
            프로필 수정
          </button>
          <button 
            onClick={handleLogout} 
            className="px-6 py-2.5 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-all flex items-center justify-center space-x-2 shadow-sm">
            <LogOut className="w-5 h-5" />
            <span>로그아웃</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;