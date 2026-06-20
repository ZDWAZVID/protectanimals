/**
 * 守护地球 — 动物保护助手聊天机器人
 */

document.addEventListener('DOMContentLoaded', () => {

    const chatbotWidget = document.getElementById('chatbotWidget');
    const chatbotToggle = document.getElementById('chatbotToggle');
    const chatbotWindow = document.getElementById('chatbotWindow');
    const chatbotClose = document.getElementById('chatbotClose');
    const chatbotMessages = document.getElementById('chatbotMessages');
    const chatbotInput = document.getElementById('chatbotInput');
    const chatbotSend = document.getElementById('chatbotSend');
    const chatbotBadge = document.getElementById('chatbotBadge');

    let isOpen = false;
    let unreadCount = 0;

    // ==================== 知识库 ====================
    const knowledgeBase = {
        // 通用问候
        greetings: ['你好', '您好', 'hi', 'hello', '嗨', '在吗', '有人在吗'],
        greetingResponse: '你好！我是动物保护助手 🐾 有什么关于动物保护的问题想了解吗？',

        // 动物保护知识
        animals: {
            '大熊猫': {
                status: '易危 (VU)',
                population: '野外约 1,864 只（2015年数据）',
                habitat: '中国四川、陕西和甘肃的山区竹林',
                threats: '栖息地破碎化、竹笋开花周期导致食物短缺',
                conservation: '中国建立了67个大熊猫自然保护区，人工繁育工作取得显著成效。2016年，大熊猫从"濒危"降级为"易危"。',
                funFact: '大熊猫每天要吃12-38公斤竹子，幼崽出生时体重仅为母亲的1/900！'
            },
            '华南虎': {
                status: '极危 (CR)，可能野外灭绝',
                population: '野外可能不足30只，圈养约200只',
                habitat: '中国东南部山区森林',
                threats: '栖息地丧失、非法狩猎、猎物减少',
                conservation: '华南虎是中国特有的虎亚种，目前主要依靠圈养繁育。中国正在推进野化放归项目。',
                funFact: '华南虎是所有虎亚种中最濒危的一种，被认为是最接近原始虎的亚种。'
            },
            '穿山甲': {
                status: '极危 (CR)',
                population: '过去10年数量下降超过80%',
                habitat: '亚洲和非洲的森林、草原',
                threats: '非法贸易（世界上被贩运最多的哺乳动物）、栖息地破坏',
                conservation: '2020年，中国将穿山甲升级为国家一级保护动物。CITES已将全部8种穿山甲列入附录I，禁止国际贸易。',
                funFact: '一只穿山甲每年可以吃掉约7000万只蚂蚁和白蚁，是天然的"害虫防治专家"！'
            },
            '朱鹮': {
                status: '濒危 (EN)',
                population: '全球约 7,000 只（2021年数据）',
                habitat: '中国、日本、韩国的湿地和稻田',
                threats: '农药污染、湿地减少、人类活动干扰',
                conservation: '中国朱鹮保护被誉为世界濒危物种保护的成功典范。从1981年仅发现7只，到如今超过7,000只。',
                funFact: '朱鹮的羽毛在繁殖季节会从白色变成灰色，这是它们用分泌物"化妆"的结果！'
            },
            '扬子鳄': {
                status: '极危 (CR)',
                population: '野外约 150-200 只',
                habitat: '中国长江下游的湿地和沼泽',
                threats: '栖息地被开垦为农田、水域污染',
                conservation: '中国建立了扬子鳄自然保护区，人工繁育技术成熟。每年都有圈养扬子鳄被放归野外。',
                funFact: '扬子鳄是中国唯一的鳄鱼物种，也是最温顺的鳄鱼之一，从无主动攻击人类的记录。'
            },
            '雪豹': {
                status: '易危 (VU)',
                population: '全球约 4,000-6,500 只',
                habitat: '中亚和南亚的高山地区，海拔3,000-4,500米',
                threats: '气候变化导致栖息地缩减、猎物减少、人兽冲突',
                conservation: '中国拥有全球约60%的雪豹栖息地。多个国际组织正在中亚地区开展雪豹保护项目。',
                funFact: '雪豹被称为"高山幽灵"，它们极擅长伪装，即使在近距离也很难被发现。'
            }
        },

        // 保护组织
        organizations: {
            'WWF': '世界自然基金会（WWF）是全球最大的自然保护组织之一，成立于1961年。官方网站：https://www.worldwildlife.org/',
            'IUCN': '世界自然保护联盟（IUCN）是评估物种保护状况的权威机构，每年发布濒危物种红色名录。官网：https://www.iucn.org/',
            'WCS': '野生动物保护协会（WCS）致力于保护野生动物和自然栖息地，在全球60多个国家开展工作。',
            'CITES': '《濒危野生动植物种国际贸易公约》（CITES）是管制野生动物国际贸易的国际公约，有183个缔约国。'
        },

        // FAQ
        faq: {
            '怎么帮助': '你可以通过以下方式帮助保护动物：\n🐾 拒绝购买野生动物制品\n💰 捐款支持保护组织\n🌱 减少塑料使用\n📢 传播保护理念\n🛒 选择可持续产品\n📸 参与公民科学项目',
            '志愿者': '欢迎加入我们的志愿者团队！请通过以下方式联系我们：\n📧 邮箱：volunteer@protectanimals.org\n📞 电话：+86 400-888-9999\n或者填写我们网站的"联系我们"表单，选择"志愿服务"主题。',
            '捐款': '感谢您的慷慨支持！请通过以下渠道捐款：\n💚 官网在线捐款\n🏦 银行转账\n💳 每月自动捐赠\n所有捐款将用于野生动物保护项目。详情请联系：donate@protectanimals.org',
            '举报': '如果您发现非法野生动物贸易行为，请立即举报：\n🚨 举报热线：+86 400-888-9999\n📧 举报邮箱：report@protectanimals.org\n🛡️ 我们会严格保密举报人信息。\n您也可以拨打110或向当地森林公安举报。',
            '濒危物种': '根据IUCN红色名录，全球有超过40,000个物种面临灭绝威胁。其中：\n🔴 极危（CR）：如华南虎、穿山甲、扬子鳄\n🟠 濒危（EN）：如朱鹮、丹顶鹤、绿孔雀\n🟡 易危（VU）：如大熊猫、雪豹、中华白海豚\n想了解某种具体的动物吗？请告诉我它的名字。',
        }
    };

    // ==================== 开关聊天窗口 ====================
    chatbotToggle.addEventListener('click', () => {
        openChatbot();
    });

    chatbotClose.addEventListener('click', () => {
        closeChatbot();
    });

    function openChatbot() {
        isOpen = true;
        chatbotWindow.classList.add('open');
        chatbotToggle.style.transform = 'scale(0)';
        // 清除未读
        unreadCount = 0;
        updateBadge();
        // 聚焦输入框
        setTimeout(() => chatbotInput.focus(), 300);
    }

    function closeChatbot() {
        isOpen = false;
        chatbotWindow.classList.remove('open');
        chatbotToggle.style.transform = 'scale(1)';
    }

    // ==================== 发送消息 ====================
    function sendMessage() {
        const text = chatbotInput.value.trim();
        if (!text) return;

        // 添加用户消息
        addMessage(text, 'user');

        // 清空输入
        chatbotInput.value = '';

        // 显示输入中状态
        showTyping();

        // 模拟思考延迟后回复
        setTimeout(() => {
            removeTyping();
            const response = getBotResponse(text);
            addMessage(response, 'bot');
        }, 600 + Math.random() * 800);
    }

    chatbotSend.addEventListener('click', sendMessage);

    chatbotInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });

    // ==================== 添加消息到聊天窗口 ====================
    function addMessage(text, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}`;

        const avatar = document.createElement('div');
        avatar.className = 'message-avatar';
        avatar.textContent = sender === 'bot' ? '🐼' : '👤';

        const content = document.createElement('div');
        content.className = 'message-content';

        // 支持换行
        const paragraphs = text.split('\n');
        paragraphs.forEach(p => {
            if (p.trim()) {
                const pEl = document.createElement('p');
                pEl.textContent = p;
                content.appendChild(pEl);
            }
        });

        messageDiv.appendChild(avatar);
        messageDiv.appendChild(content);
        chatbotMessages.appendChild(messageDiv);

        // 滚动到底部
        chatbotMessages.scrollTop = chatbotMessages.scrollHeight;

        // 如果窗口关闭，增加未读计数
        if (!isOpen && sender === 'bot') {
            unreadCount++;
            updateBadge();
        }
    }

    // ==================== 输入中状态 ====================
    function showTyping() {
        const typingDiv = document.createElement('div');
        typingDiv.className = 'message bot';
        typingDiv.id = 'typingIndicator';

        const avatar = document.createElement('div');
        avatar.className = 'message-avatar';
        avatar.textContent = '🐼';

        const content = document.createElement('div');
        content.className = 'message-content';
        content.innerHTML = '<span class="typing-dots"><span>.</span><span>.</span><span>.</span></span>';

        typingDiv.appendChild(avatar);
        typingDiv.appendChild(content);
        chatbotMessages.appendChild(typingDiv);
        chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
    }

    function removeTyping() {
        const typing = document.getElementById('typingIndicator');
        if (typing) typing.remove();
    }

    // ==================== 更新未读徽章 ====================
    function updateBadge() {
        if (unreadCount > 0) {
            chatbotBadge.textContent = unreadCount > 99 ? '99+' : unreadCount;
            chatbotBadge.classList.add('visible');
        } else {
            chatbotBadge.classList.remove('visible');
        }
    }

    // ==================== 机器人回复逻辑 ====================
    function getBotResponse(text) {
        const input = text.toLowerCase().trim();

        // 1. 检查问候语
        if (knowledgeBase.greetings.some(g => input.includes(g))) {
            return knowledgeBase.greetingResponse;
        }

        // 2. 检查动物名称
        for (const [animal, info] of Object.entries(knowledgeBase.animals)) {
            if (input.includes(animal.toLowerCase())) {
                return formatAnimalInfo(animal, info);
            }
        }

        // 3. 检查保护组织
        if (input.includes('wwf') || input.includes('世界自然基金会')) {
            return knowledgeBase.organizations['WWF'];
        }
        if (input.includes('iucn') || input.includes('世界自然保护联盟')) {
            return knowledgeBase.organizations['IUCN'];
        }
        if (input.includes('wcs') || input.includes('野生动物保护协会')) {
            return knowledgeBase.organizations['WCS'];
        }
        if (input.includes('cites') || input.includes('华盛顿公约')) {
            return knowledgeBase.organizations['CITES'];
        }

        // 4. 检查FAQ关键词
        if (input.includes('帮') || input.includes('参与') || input.includes('怎么做') || input.includes('如何保护')) {
            return knowledgeBase.faq['怎么帮助'];
        }
        if (input.includes('志愿') || input.includes('义工')) {
            return knowledgeBase.faq['志愿者'];
        }
        if (input.includes('捐') || input.includes('资助') || input.includes('支持')) {
            return knowledgeBase.faq['捐款'];
        }
        if (input.includes('举报') || input.includes('非法') || input.includes('盗猎') || input.includes('贸易')) {
            return knowledgeBase.faq['举报'];
        }
        if (input.includes('濒危') || input.includes('灭绝') || input.includes('保护级别') || input.includes('红色名录')) {
            return knowledgeBase.faq['濒危物种'];
        }
        if (input.includes('联系') || input.includes('电话') || input.includes('邮箱') || input.includes('地址')) {
            return '📬 我们的联系方式：\n📍 地址：中国北京市朝阳区生态保护大厦 1208 室\n📧 邮箱：info@protectanimals.org\n📞 电话：+86 400-888-9999\n🕐 工作时间：周一至周五 9:00-18:00\n\n你也可以填写网站上的"联系我们"表单！';
        }

        // 5. 关于网站/组织
        if (input.includes('组织') || input.includes('你们是') || input.includes('关于') || input.includes('介绍')) {
            return '🌍 守护地球是一个致力于野生动物保护和生物多样性维护的非营利组织。\n\n我们的使命：\n🐾 保护濒危物种及其栖息地\n📚 开展公众教育和意识提升\n🤝 推动国际合作与政策倡导\n🔬 支持野生动物科学研究\n\n想了解更多？请访问我们的网站或联系我们！';
        }

        // 6. 感谢
        if (input.includes('谢谢') || input.includes('感谢') || input.includes('thank')) {
            return '不客气！💚 感谢你对动物保护的关注和支持。每一个关心野生动物的人都是地球的守护者！\n\n如果你有更多问题，随时可以问我哦 🐾';
        }

        // 7. 默认回复
        const defaultResponses = [
            '很好的问题！不过我还需要学习更多关于这方面的知识。你想了解某种具体的动物吗？比如大熊猫、雪豹、穿山甲？\n\n你也可以问我关于：\n🐾 如何参与保护行动\n📋 濒危物种信息\n🤝 志愿者和捐款方式',
            '这是一个值得关注的话题！虽然我暂时无法提供详细的信息，但我可以帮你了解以下内容：\n🐅 华南虎、朱鹮、扬子鳄等濒危动物\n💚 如何帮助保护动物\n📞 联系方式和志愿服务\n请告诉我你想了解哪个方面？',
            '感谢你对动物保护的关心！🌿\n我可以为你介绍：\n🐼 各种濒危动物的信息\n🤝 保护组织的联系方式\n💡 参与保护行动的方法\n请具体告诉我你想了解什么？'
        ];
        return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
    }

    // ==================== 格式化动物信息 ====================
    function formatAnimalInfo(animal, info) {
        return `🐾 关于 ${animal}：\n\n` +
               `📊 保护状态：${info.status}\n` +
               `🔢 种群数量：${info.population}\n` +
               `🏠 栖息地：${info.habitat}\n` +
               `⚠️ 主要威胁：${info.threats}\n` +
               `🛡️ 保护措施：${info.conservation}\n` +
               `💡 趣味知识：${info.funFact}`;
    }

    // ==================== 支持点击外部关闭 ====================
    document.addEventListener('click', (e) => {
        if (isOpen &&
            !chatbotWindow.contains(e.target) &&
            !chatbotToggle.contains(e.target)) {
            closeChatbot();
        }
    });

    // ==================== ESC 关闭 ====================
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && isOpen) {
            closeChatbot();
        }
    });

    // ==================== 添加输入中动画CSS ====================
    const style = document.createElement('style');
    style.textContent = `
        .typing-dots {
            display: inline-flex;
            gap: 4px;
            align-items: center;
            padding: 4px 0;
        }
        .typing-dots span {
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background: #bdbdbd;
            animation: typingBounce 1.4s infinite;
        }
        .typing-dots span:nth-child(2) { animation-delay: 0.2s; }
        .typing-dots span:nth-child(3) { animation-delay: 0.4s; }
        @keyframes typingBounce {
            0%, 60%, 100% { transform: translateY(0); }
            30% { transform: translateY(-6px); }
        }

        /* Toast 样式 */
        .toast {
            position: fixed;
            top: 24px;
            left: 50%;
            transform: translateX(-50%) translateY(-120px);
            padding: 14px 28px;
            border-radius: 50px;
            font-size: 0.95rem;
            font-weight: 600;
            z-index: 9999;
            transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
            font-family: 'Noto Sans SC', sans-serif;
        }
        .toast.show {
            transform: translateX(-50%) translateY(0);
        }
        .toast-success {
            background: #2d8a4e;
            color: white;
        }
        .toast-warning {
            background: #f9a825;
            color: #333;
        }
        .toast-error {
            background: #d32f2f;
            color: white;
        }
    `;
    document.head.appendChild(style);

});
