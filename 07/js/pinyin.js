/**
 * 轻量中文 → 拼音（姓名场景）
 * 正序：姓 + 名，每音节首字母大写，空格分隔
 * 覆盖常见姓氏 + 高频人名用字；多音字按姓氏/常用读音处理
 */
(function (global) {
  'use strict';

  // 常见姓氏优先读音（含多音字）
  const SURNAME_READINGS = {
    曾: 'zeng', 解: 'xie', 查: 'zha', 仇: 'qiu', 单: 'shan', 朴: 'piao',
    繁: 'po', 燕: 'yan', 尉: 'yu', 秘: 'bi', 乐: 'yue', 重: 'chong',
    区: 'ou', 黑: 'he', 盖: 'ge', 任: 'ren', 华: 'hua', 便: 'bian',
    都: 'du', 缪: 'miao', 句: 'gou', 阿: 'e', 折: 'she', 覃: 'qin',
    翟: 'zhai', 纪: 'ji', 燕: 'yan', 谁: 'she', 员: 'yun', 阚: 'kan',
    邠: 'bin', 郇: 'xun', 儿: 'ni', 覃: 'qin', 乘: 'sheng',
  };

  // 音节 → 汉字（常用 3500 字级，人名覆盖优先）
  const TABLE = {
    a: '啊阿吖嗄',
    ai: '爱哀挨唉埃矮碍艾癌蔼',
    an: '安按案暗岸俺氨鞍谙',
    ang: '昂盎',
    ao: '奥澳傲凹熬敖袄懊',
    ba: '八把爸巴吧拔霸坝芭疤跋',
    bai: '白百败摆伯柏掰',
    ban: '半办班版般搬板伴扮斑',
    bang: '帮邦榜绑棒磅蚌',
    bao: '包报保宝抱暴薄胞饱堡豹刨褒苞',
    bei: '北被备背倍杯贝悲碑卑辈臂',
    ben: '本奔笨夯',
    beng: '崩绷甭泵蹦',
    bi: '比必笔毕闭避币壁臂彼碧鼻毙蔽鄙痹',
    bian: '边变便遍编鞭扁辨辩辫贬蝙',
    biao: '表标彪飙镖',
    bie: '别憋鳖瘪',
    bin: '宾滨彬斌鬓缤',
    bing: '并病兵冰饼丙柄秉',
    bo: '波博播伯薄玻泊驳脖勃搏渤箔',
    bu: '不部布步补捕簿怖卜哺',
    ca: '擦',
    cai: '才材财采菜彩裁猜踩',
    can: '参残餐惨灿蚕惭',
    cang: '仓苍沧舱藏',
    cao: '草操曹槽糙嘈',
    ce: '侧测册策厕',
    ceng: '层曾蹭',
    cha: '查茶差插叉察岔刹',
    chai: '柴拆豺',
    chan: '产缠禅蝉馋颤铲',
    chang: '长常场厂唱尝畅昌肠偿敞倡',
    chao: '超朝潮抄吵炒嘲',
    che: '车彻撤尺扯澈',
    chen: '陈沉晨尘臣趁称衬辰',
    cheng: '成城程承诚称乘呈盛撑惩橙澄',
    chi: '吃池迟持尺赤翅耻斥齿痴驰',
    chong: '充冲虫崇重宠',
    chou: '抽愁仇丑筹酬绸稠瞅',
    chu: '出处初除楚厨触储畜础',
    chuai: '揣踹',
    chuan: '川船传串穿喘',
    chuang: '床窗创闯疮',
    chui: '吹垂锤炊',
    chun: '春纯唇醇蠢',
    chuo: '戳绰',
    ci: '次此词刺辞慈磁雌瓷',
    cong: '从丛聪葱匆',
    cou: '凑',
    cu: '粗促醋簇',
    cui: '崔催脆翠摧粹',
    cun: '村存寸',
    cuo: '错措挫撮',
    da: '大打达答搭瘩',
    dai: '带代待戴袋呆贷逮怠',
    dan: '但单蛋担丹淡旦胆弹耽',
    dang: '当党挡档荡',
    dao: '到道倒岛刀导盗蹈稻悼祷',
    de: '的得德地',
    deng: '等登灯邓凳瞪',
    di: '地第低底弟敌递滴帝抵笛迪狄',
    dian: '点电店典垫殿颠',
    diao: '调掉钓吊雕叼',
    die: '跌叠蝶爹谍',
    ding: '定订顶丁盯钉鼎',
    diu: '丢',
    dong: '东动懂冬洞冻董栋',
    dou: '都斗豆逗抖兜',
    du: '度都读独毒杜堵督渡肚妒镀',
    duan: '段短断端缎',
    dui: '对队堆兑',
    dun: '顿吨蹲盾敦钝',
    duo: '多朵夺躲堕舵',
    e: '额恶饿俄鹅鄂峨',
    en: '恩嗯',
    er: '而二耳儿尔饵',
    fa: '发法罚乏伐阀',
    fan: '反饭犯范翻凡烦繁贩帆番樊',
    fang: '方放防房访仿纺芳坊',
    fei: '非飞费肥废肺菲匪斐',
    fen: '分份粉奋愤芬纷坟',
    feng: '风封丰峰凤锋疯逢缝枫',
    fo: '佛',
    fou: '否',
    fu: '服福府副富夫复父付负妇附扶浮符腐赴赋腹覆抚伏傅',
    ga: '嘎',
    gai: '该改盖概溉丐',
    gan: '干感敢赶甘肝杆橄',
    gang: '刚钢港岗纲缸',
    gao: '高告搞稿糕膏羔',
    ge: '个各哥歌格革隔阁割葛戈鸽',
    gei: '给',
    gen: '根跟',
    geng: '更耕庚羹',
    gong: '工公共功攻宫供贡巩弓',
    gou: '够狗构购沟勾钩苟',
    gu: '古故顾谷固股姑骨孤鼓估谷菇咕',
    gua: '挂瓜刮寡褂',
    guai: '怪乖拐',
    guan: '关管观官馆惯冠罐灌贯',
    guang: '光广逛',
    gui: '归贵鬼规柜轨桂跪龟闺',
    gun: '滚棍',
    guo: '国过果锅郭裹',
    ha: '哈',
    hai: '海还害孩亥嗨',
    han: '汉韩含寒汗喊函涵翰',
    hang: '行航杭夯',
    hao: '好号浩豪耗郝皓',
    he: '和合何河喝核荷贺盒禾赫褐',
    hei: '黑嘿',
    hen: '很狠恨痕',
    heng: '横恒衡哼',
    hong: '红洪宏轰虹鸿弘',
    hou: '后厚候侯喉猴吼',
    hu: '湖户护虎胡呼忽互沪糊狐蝴弧壶',
    hua: '花华化话画划滑哗桦',
    huai: '坏怀槐淮踝',
    huan: '欢还换环缓患唤幻焕宦',
    huang: '黄皇荒慌煌凰晃',
    hui: '会回挥辉汇惠灰恢慧毁徽晖',
    hun: '婚混魂昏浑',
    huo: '或活火货获伙祸霍豁',
    ji: '机记级几及计季基极集积际鸡急既激继绩寄挤寂籍疾肌迹',
    jia: '家加价假佳甲架嫁夹嘉驾贾',
    jian: '见间件建坚检减简健剑渐肩兼尖监艰荐鉴',
    jiang: '江将讲奖降姜疆僵匠',
    jiao: '教交叫角脚较觉骄郊搅焦蕉',
    jie: '接节姐街借介界结届解洁杰阶截劫',
    jin: '金今进近尽紧仅禁津斤锦晋',
    jing: '经京精境静敬警竟净镜景晶惊竞',
    jiong: '窘',
    jiu: '就九旧究酒久救纠舅',
    ju: '局举具据居剧句拒巨菊矩聚惧',
    juan: '卷捐倦绢',
    jue: '决觉绝爵嚼崛',
    jun: '军均君俊菌峻钧',
    ka: '卡咖咯',
    kai: '开凯慨楷',
    kan: '看刊砍堪勘',
    kang: '康抗炕扛糠',
    kao: '考靠烤铐',
    ke: '可科克客课颗渴壳柯苛',
    ken: '肯恳垦啃',
    keng: '坑',
    kong: '空孔控恐',
    kou: '口扣寇',
    ku: '苦库裤枯酷窟',
    kua: '跨夸垮胯',
    kuai: '快块筷',
    kuan: '宽款',
    kuang: '况矿框狂旷眶',
    kui: '亏愧溃奎',
    kun: '困昆捆',
    kuo: '扩阔括',
    la: '拉啦辣蜡喇',
    lai: '来赖莱',
    lan: '兰蓝烂懒栏拦览滥',
    lang: '浪朗郎狼廊',
    lao: '老劳牢捞姥唠',
    le: '乐了勒',
    lei: '类累雷泪蕾磊',
    leng: '冷楞',
    li: '里理力立李丽利例历离礼厉黎梨粒励璃莉荔犁',
    lia: '俩',
    lian: '连联练恋脸莲廉怜链帘',
    liang: '两量良亮梁凉粮辆晾',
    liao: '了料聊疗辽寥',
    lie: '列烈猎裂劣',
    lin: '林临邻琳磷鳞霖',
    ling: '令领零另灵岭玲铃伶凌陵',
    liu: '六流留刘柳溜硫榴',
    long: '龙隆笼聋咙',
    lou: '楼漏露陋',
    lu: '路陆录鲁露卢芦炉鹿禄碌',
    luan: '乱卵峦',
    lun: '论轮伦',
    luo: '罗落洛络骆萝锣',
    lv: '绿吕旅律率虑滤铝驴',
    ma: '马吗妈麻码骂玛蚂',
    mai: '买卖麦埋脉',
    man: '满慢漫曼蛮馒',
    mang: '忙盲茫芒',
    mao: '猫毛贸冒帽茂茅',
    me: '么',
    mei: '没每美妹梅煤眉媒玫枚',
    men: '门们闷',
    meng: '孟猛蒙盟梦萌',
    mi: '米密迷秘蜜谜觅',
    mian: '面免棉眠绵勉',
    miao: '秒妙苗庙描渺',
    mie: '灭蔑',
    min: '民敏闽悯',
    ming: '明名命鸣铭冥',
    miu: '谬',
    mo: '模磨末莫墨摸膜默摩魔沫陌',
    mou: '某谋牟',
    mu: '木目母幕牧墓慕穆亩牡',
    na: '那拿哪纳娜呐',
    nai: '奶耐乃奈',
    nan: '南难男楠',
    nang: '囊',
    nao: '脑闹恼挠',
    ne: '呢',
    nei: '内那',
    nen: '嫩',
    neng: '能',
    ni: '你尼泥逆拟妮倪霓',
    nian: '年念粘捻碾',
    niang: '娘酿',
    niao: '鸟尿',
    nie: '捏聂',
    nin: '您',
    ning: '宁凝拧',
    niu: '牛扭纽钮',
    nong: '农浓弄',
    nu: '怒努奴',
    nuan: '暖',
    nue: '虐',
    nuo: '诺挪懦',
    nv: '女',
    o: '哦噢',
    ou: '欧偶呕藕鸥',
    pa: '怕爬帕趴啪',
    pai: '排拍派牌徘',
    pan: '判盘盼潘攀叛畔',
    pang: '旁胖庞膀',
    pao: '跑抛炮袍泡',
    pei: '配培陪赔佩沛裴',
    pen: '喷盆',
    peng: '朋彭碰棚捧蓬鹏',
    pi: '皮批披匹屁疲僻譬啤',
    pian: '片便篇偏骗扁',
    piao: '票飘漂瓢',
    pie: '撇瞥',
    pin: '品贫拼聘频',
    ping: '平评瓶苹凭萍坪屏',
    po: '破坡婆迫泊泼颇',
    pou: '剖',
    pu: '普铺葡朴浦谱蒲',
    qi: '起其期七气企器齐奇骑棋启弃汽妻旗契祈泣戚',
    qia: '恰掐洽',
    qian: '前千钱浅签欠潜牵迁铅谦乾钳',
    qiang: '强抢枪墙腔羌',
    qiao: '桥巧敲悄瞧乔俏翘',
    qie: '切且窃茄',
    qin: '亲琴勤侵秦芹禽擒',
    qing: '情请清青轻庆倾晴氢卿',
    qiong: '穷琼',
    qiu: '秋求球丘邱囚酋',
    qu: '去区取曲趋娶屈驱渠躯',
    quan: '全权圈泉劝拳犬券',
    que: '却确缺雀瘸',
    qun: '群裙',
    ran: '然染燃',
    rang: '让嚷壤',
    rao: '绕扰饶',
    re: '热惹',
    ren: '人认任仁忍刃韧',
    reng: '仍扔',
    ri: '日',
    rong: '容荣融绒蓉熔',
    rou: '肉柔揉',
    ru: '如入乳儒辱汝茹',
    ruan: '软阮',
    rui: '瑞锐蕊',
    run: '润闰',
    ruo: '若弱',
    sa: '撒洒萨',
    sai: '赛塞腮',
    san: '三散伞',
    sang: '桑丧嗓',
    sao: '扫嫂骚',
    se: '色涩瑟',
    sen: '森',
    seng: '僧',
    sha: '沙杀纱傻煞啥莎鲨',
    shai: '晒',
    shan: '山善闪单扇删衫珊陕擅',
    shang: '上商伤尚赏晌',
    shao: '少绍烧稍勺邵哨',
    she: '社设射舌蛇摄舍涉赦',
    shen: '申深身神甚伸慎沈肾审渗绅',
    sheng: '生声省胜升圣盛剩绳笙',
    shi: '是时事十市石实使世式识失施始士史诗师试食视室适势释氏饰湿狮拾蚀',
    shou: '手受收首守授瘦寿兽熟',
    shu: '书数术输树述术属熟暑殊舒鼠束叔梳疏蔬',
    shua: '刷耍',
    shuai: '帅甩衰摔率',
    shuan: '拴栓涮',
    shuang: '双爽霜',
    shui: '水谁税睡',
    shun: '顺瞬舜',
    shuo: '说朔硕',
    si: '四死思司丝私斯似寺撕嘶',
    song: '送松宋颂搜耸',
    sou: '搜艘',
    su: '苏素速诉塑宿俗溯酥',
    suan: '算酸蒜',
    sui: '虽岁随碎遂穗隋',
    sun: '孙损笋',
    suo: '所锁索缩梭',
    ta: '他她它踏塔塌榻',
    tai: '太台态抬泰胎钛',
    tan: '但谈探摊贪坛滩瘫毯',
    tang: '唐堂糖汤躺塘棠趟',
    tao: '套讨逃桃陶淘涛萄',
    te: '特',
    teng: '腾疼藤',
    ti: '体题提替踢梯蹄剃',
    tian: '天田甜添填',
    tiao: '条调跳挑眺',
    tie: '铁贴帖',
    ting: '听停庭挺亭艇钉',
    tong: '同通统痛童铜桐桶',
    tou: '头投透偷',
    tu: '图土突途徒兔涂吐屠',
    tuan: '团',
    tui: '推退腿蜕',
    tun: '吞屯臀',
    tuo: '托脱拖妥驼椭',
    wa: '娃挖瓦洼蛙袜',
    wai: '外歪',
    wan: '万完晚玩碗弯湾丸挽',
    wang: '王往望网忘亡旺汪',
    wei: '为位未维威伟卫尾微围违胃唯味谓魏蔚慰纬',
    wen: '文问闻稳温纹吻',
    weng: '翁嗡',
    wo: '我握卧窝沃蜗',
    wu: '无五午物务武屋误悟雾吴舞污乌伍勿侮捂',
    xi: '西系希习细吸洗喜戏息席袭析稀溪悉昔熄锡晰膝',
    xia: '下夏吓峡霞虾狭霞',
    xian: '现先线县显限鲜闲贤险献咸羡掀纤嫌馅',
    xiang: '想相向象像香乡详响项享巷橡湘厢翔',
    xiao: '小笑校消效晓销肖萧孝啸宵',
    xie: '写些谢鞋协斜携胁卸泄歇械屑谐',
    xin: '新心信欣辛薪芯馨',
    xing: '行性姓形星兴型醒幸刑杏',
    xiong: '雄兄熊胸凶',
    xiu: '修休秀锈绣羞嗅',
    xu: '需须许续须虚徐序蓄绪旭叙絮婿',
    xuan: '选宣悬旋喧玄轩',
    xue: '学血雪穴靴',
    xun: '寻训讯迅巡询逊循勋熏',
    ya: '亚压呀牙雅鸭芽哑崖',
    yan: '眼研验演言烟严盐岩沿延颜掩宴艳雁焰',
    yang: '阳样养洋杨羊仰扬痒氧央秧漾',
    yao: '要药摇腰邀咬遥姚瑶窑耀',
    ye: '也业夜叶爷野页液冶',
    yi: '一以已意义议艺易医依衣移亿仪疑遗益宜异忆椅翼译乙姨毅逸壹',
    yin: '因引印银音阴饮隐姻吟茵',
    ying: '应影英营迎硬赢盈婴樱鹰荧莹颖',
    yong: '用永勇拥涌咏泳雍',
    you: '有又由友游油优右邮幼幽悠尤犹佑',
    yu: '于与语育鱼雨余遇玉预域宇羽愈愉愚娱渔榆瑜禹',
    yuan: '元原院远愿园圆源援缘袁猿',
    yue: '月越约跃悦岳粤钥',
    yun: '运云允韵孕芸晕匀陨',
    za: '杂砸咂',
    zai: '在再载灾栽宰',
    zan: '赞暂咱攒',
    zang: '藏脏葬',
    zao: '早造遭糟枣澡躁',
    ze: '则责泽择',
    zei: '贼',
    zen: '怎',
    zeng: '增曾赠憎',
    zha: '扎炸查眨渣闸榨',
    zhai: '摘窄债斋宅',
    zhan: '站展战占沾粘斩盏',
    zhang: '张章长掌涨丈帐账障胀樟彰',
    zhao: '找照招赵朝召兆诏',
    zhe: '这着者折哲浙蔗',
    zhen: '真镇阵针震珍诊侦振枕贞甄',
    zheng: '正政争整证郑征蒸睁挣',
    zhi: '之只知直至指制志纸职支治织值枝汁旨址致智秩殖脂芝蜘',
    zhong: '中种重众终钟忠仲盅',
    zhou: '周州洲舟粥皱宙轴昼',
    zhu: '主住助著竹逐猪注祝筑朱珠株烛嘱贮铸',
    zhua: '抓',
    zhuai: '拽',
    zhuan: '专转传赚砖撰',
    zhuang: '状装庄壮撞妆桩',
    zhui: '追坠缀锥',
    zhun: '准',
    zhuo: '桌捉卓浊灼酌啄',
    zi: '子自字资紫姿仔滋咨',
    zong: '总纵综宗棕踪',
    zou: '走奏揍邹',
    zu: '组足族祖阻租卒',
    zuan: '钻',
    zui: '最嘴罪醉堆',
    zun: '尊遵',
    zuo: '做作坐左座昨佐',
  };

  // 构建 汉字 → 拼音
  const CHAR_MAP = Object.create(null);
  for (const py in TABLE) {
    for (const ch of TABLE[py]) {
      if (!(ch in CHAR_MAP)) CHAR_MAP[ch] = py;
    }
  }
  // 姓氏读音覆盖
  Object.assign(CHAR_MAP, SURNAME_READINGS);

  // 复姓（两字姓）
  const COMPOUND_SURNAMES = [
    '欧阳', '司马', '诸葛', '上官', '东方', '皇甫', '尉迟', '公孙',
    '慕容', '长孙', '宇文', '司徒', '鲜于', '轩辕', '令狐', '钟离',
    '闾丘', '子车', '亓官', '巫马', '公西', '颛孙', '壤驷', '公良',
    '漆雕', '乐正', '宰父', '谷梁', '法汝', '段干', '百里', '东郭',
    '南门', '呼延', '羊舌', '微生', '梁丘', '左丘', '东门', '西门',
    '南宫', '第五',
  ];

  function isChinese(ch) {
    const code = ch.codePointAt(0);
    return (
      (code >= 0x4e00 && code <= 0x9fff) ||
      (code >= 0x3400 && code <= 0x4dbf)
    );
  }

  function syllableToTitle(py) {
    if (!py) return '';
    return py.charAt(0).toUpperCase() + py.slice(1);
  }

  function charPinyin(ch, isSurnameHead) {
    if (isSurnameHead && SURNAME_READINGS[ch]) return SURNAME_READINGS[ch];
    return CHAR_MAP[ch];
  }

  /**
   * 中文姓名 → 正序拼音（姓在前，姓/名各一词）
   * 林思远 → Lin Siyuan
   * 欧阳明月 → Ouyang Mingyue
   */
  function nameToPinyin(name) {
    const chars = Array.from(String(name || '').trim().replace(/\s+/g, ''));
    if (!chars.length) return '';

    // 只处理开头的中文姓名段
    let i = 0;
    const chinese = [];
    while (i < chars.length && isChinese(chars[i])) {
      chinese.push(chars[i]);
      i++;
    }
    const restLatin = chars
      .slice(i)
      .join('')
      .replace(/[^A-Za-z]/g, '');
    if (!chinese.length) {
      return restLatin
        ? restLatin
            .split(/(?=[A-Z])|[\s_-]+/)
            .filter(Boolean)
            .map(syllableToTitle)
            .join(' ')
        : '';
    }

    // 识别姓：优先复姓，否则单姓
    let surnameLen = 1;
    const head2 = chinese.slice(0, 2).join('');
    if (chinese.length >= 2 && COMPOUND_SURNAMES.includes(head2)) {
      surnameLen = 2;
    }

    const surnameChars = chinese.slice(0, surnameLen);
    const givenChars = chinese.slice(surnameLen);

    const surnamePy = surnameChars
      .map((ch, idx) => charPinyin(ch, idx === 0))
      .join('');
    // 名：各字拼音连写，整体首字母大写（Siyuan）
    const givenPy = givenChars.map((ch) => charPinyin(ch, false) || '').join('');

    const parts = [];
    if (surnamePy) parts.push(syllableToTitle(surnamePy));
    if (givenPy) parts.push(syllableToTitle(givenPy));
    if (restLatin) parts.push(syllableToTitle(restLatin.toLowerCase()));
    return parts.join(' ');
  }

  global.PinyinLite = { nameToPinyin, CHAR_MAP };
})(typeof window !== 'undefined' ? window : globalThis);
