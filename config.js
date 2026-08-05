/**
 * Wedding Invitation Configuration
 *
 * 이 파일에서 청첩장의 모든 정보를 수정할 수 있습니다.
 * 이미지는 설정이 필요 없습니다. 아래 폴더에 순번 파일명으로 넣으면 자동 감지됩니다.
 *
 * 이미지 폴더 구조 (파일명 규칙):
 * images/hero/1.jpg      - 메인 사진 (1장, 필수)
 * images/story/1.jpg, 2.jpg, ...  - 스토리 사진들 (순번, 자동 감지)
 * images/gallery/1.jpg, 2.jpg, ... - 갤러리 사진들 (순번, 자동 감지)
 * images/location/1.jpg  - 약도/지도 이미지 (1장)
 * images/og/1.jpg        - 카카오톡 공유 썸네일 (1장)
 */

const CONFIG = {
  // ── 초대장 열기 ──
  useCurtain: true,  // 초대장 열기 화면 사용 여부 (true: 사용, false: 바로 본문 표시)

  // ── 메인 (히어로) ──
  groom: {
    name: "강무성",
    nameEn: "Groom",
    father: "강신창",
    mother: "배복임",
    fatherDeceased: false,
    motherDeceased: false
  },

  bride: {
    name: "정수연",
    nameEn: "Bride",
    father: "정성채",
    mother: "김민선",
    fatherDeceased: false,
    motherDeceased: false
  },

  wedding: {
    date: "2026-09-19",
    time: "18:00",
    venue: "CN웨딩홀 계산점",
    hall: "예식 2층 베르테홀 / 신부대기실 3층",
    address: "계양구 경명대로 1108",
    tel: "032-546-0070",
    mapLinks: {
      kakao: "https://kko.to/-iDbg-HSlW",
      naver: "https://naver.me/GNWkzB3T"
    }
  },

  // ── 인사말 ──
  greeting: {
    title: "소중한 분들을 초대합니다",
    content: "같은 방향을 바라보며\n같은 내일을 약속하려 합니다.\n\n저희의 첫걸음에 함께 해 주시면\n보내주신 축복을 오래 간직하겠습니다."
  },

  // ── 우리의 이야기 ──
  story: {
    title: "두 사람이",
    content: "꽃과 나무처럼 걸어와서\n서로의 모든 것이 되기 위해\n오랜 기다림 끝에 혼례식을 치르는 날\n세상은 더욱 아름다워라\n\n\n이해인 <사랑의 사람들이여>."
  },

  // ── 오시는 길 ──
  // (mapLinks는 wedding 객체 내에 포함)

  // ── 마음 전하실 곳 ──
  accounts: {
    groom: [
      { role: "신랑", name: "강무성&nbsp; &nbsp; ", bank: "국민은행", number: "657801-01-493316" },
      { role: "아버지", name: "강신창&nbsp; &nbsp; ", bank: "국민은행", number: "657825-87-036434" },
      { role: "어머니", name: "배복임&nbsp; &nbsp; ", bank: "국민은행", number: "657801-01-010328" }
    ] 
    bride: [
      { role: "신부", name: "정수연&nbsp; &nbsp; ", bank: "카카오뱅크", number: "3333-08-0560900" },
      { role: "아버지", name: "정성채&nbsp; &nbsp; ", bank: "우리은행", number: "1002-145-856083" },
      { role: "어머니", name: "김민선&nbsp; &nbsp; ", bank: "농협은행", number: "211053-52-338669" }
    ]
  },

  // ── 링크 공유 시 나타나는 문구 ──
  meta: {
    title: "강무성 ♥ 정수연 결혼합니다",
    description: "2026년 9월 19일 18시, 소중한 분들을 초대합니다."
  }
};
