import media from './media.json';

export const profile = {
  name: '吴言',
  role: '摄像 / 剪辑 / AIGC制作',
  phone: '15055552970',
  wechat: 'wyan050317',
  wechatQr: '/media/photos/wechat-qr.png',
};

const records = [
  { id: 'yunnan', bilibiliId: 'BV1Fya86qEKg', title: '云南风光', category: 'video', type: '风光影像', role: '拍摄 · 剪辑', description: '从落日水岸到湖面飞鸟，以浪花、花丛与天空倒影串联旅途片段，记录云南风光中的宁静与生机。' },
  { id: 'shangrila', bilibiliId: 'BV1qSa86AEsX', title: '香格里拉', category: 'video', type: '旅行影像', role: '拍摄 · 剪辑', description: '将藏式建筑、经幡与身着民族服饰的人物交织呈现，在明亮的日光与鲜活的色彩中，留下香格里拉的旅行印象。' },
  { id: 'departure', bilibiliId: 'BV1ZSa86AE5s', title: '转身即是出征', category: 'video', type: '纪录片', role: '主摄像 · 主剪辑', year: '2024', description: '跟随退伍军人走进基层服务一线，通过人物讲述与日常工作，记录身份转变后的责任与坚守。', achievement: 'NCDA未来设计师大赛 · 安徽赛区一等奖' },
  { id: 'changguang', bilibiliId: 'BV1qSa86AE8K', title: '长广文艺片', category: 'video', type: '人文影像', role: '拍摄 · 剪辑', description: '跟随人物走过长广的展馆、矿区旧址与老铁路，以旧物和建筑串联工业记忆，记录这片土地的岁月与新生。' },
  { id: 'yiguo', bilibiliId: 'BV1zya86iEY6', title: '易果应聘考核试剪', category: 'video', type: '试剪作品', role: '剪辑', description: '围绕小刀电动车产品与中国航天合作信息，剪辑沙漠骑行和品牌画面，突出动力表现与产品印象。' },
  { id: 'hope', bilibiliId: 'BV1Fya86qEXX', title: 'HOPE', category: 'aigc', type: 'AI 微电影', role: '独立制作', description: '以宇航员与智能系统的对话展开，在浩瀚太空与虚拟神祇的想象中，追问科技、生命与思念。' },
  { id: 'future', bilibiliId: 'BV1Jya86qE9d', title: '向未来生长', category: 'aigc', type: '招生宣传片', role: '第三篇章脚本 · AIGC生成 · 剪辑', year: '2026', description: '从校园日常、专业探索延伸到未来想象，展现安徽师范大学的学习生活与成长可能。', achievement: '安徽师范大学2026年招生宣传片 · 整片视频号数据：点赞800+ · 转发900+ · 推荐600+' },
  { id: 'door', bilibiliId: 'BV1qSa86AEXv', title: '踢开门', category: 'aigc', type: '竖屏短片', role: 'AIGC制作 · 剪辑', description: '渴望重新奔跑的少年，在康复训练中面对内心的那扇门。以动画连接科技辅助、亲情陪伴与自我鼓励，讲述迈出一步的勇气。', achievement: '发布于 CMG中央广播电视总台安徽总站 · 累计播放量82万' },
  { id: 'six', bilibiliId: 'BV1qSa86AEQv', title: '六尺巷', category: 'aigc', type: 'AIGC短片', role: 'AIGC制作 · 剪辑', description: '从六尺巷的礼让典故，转入一场集装箱装货争执。通过跨文化合作中的理解与退让，让传统的和合智慧走进当代生活。' },
  { id: 'hero', bilibiliId: 'BV1zya86iEeu', title: '侠客', category: 'aigc', type: '视觉短片', role: 'AIGC制作 · 剪辑', description: '以云海、古刹与巨兽构建东方奇幻武侠意象，展现侠客踏入山海的冒险世界。' },
];

export const works = records.map(work => ({ ...work, ...media[work.id] }));
export const byId = Object.fromEntries(works.map(work => [work.id, work]));
const featuredIds = ['door', 'future', 'six', 'hope', 'yunnan', 'shangrila'];
export const heroIds = [...featuredIds, ...works.filter(work => !featuredIds.includes(work.id)).map(work => work.id)];
export const navItems = [
  ['home', '首页'], ['video', '视频作品'], ['aigc', 'AIGC'], ['about', '关于我'], ['contact', '联系我'],
];
export function formatDuration(seconds) {
  const total = Math.floor(seconds);
  return `${String(Math.floor(total / 60)).padStart(2, '0')}:${String(total % 60).padStart(2, '0')}`;
}
