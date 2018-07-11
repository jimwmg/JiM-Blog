define([], function() {
    return {
        unauthorize: {
            warnTip: '绩效只有上级领导才能查看哦',
            leaveTime: '后自动返回'
        },
        // 中文
        common: {
            personList: {
                show: '展开',
                hide: '收起',
                audit: '审核',
                rank: '排名',
                userName: '姓名',
                myRateScore: '我的评分',
                score: '总分',
                empty: '暂无未评价者',
                noRate: '未评价',
                plan: '计划',
                grade:'总等级'
            },
            entryDetails: '进入详情',
            assessmentUnit: '个',
            rightInfo: {
                rss: '立即关注',
                cancelRss: '取消关注',
                teamAssigin: function(isSelf) {
                    return isSelf ? '我的团队' : 'ta的团队';
                },
                rssLength: function(isSelf, length) {
                    var preStr = isSelf ? '我' : 'ta';
                    return preStr + '正在关注' + length + '人的绩效';
                },
                rssAssessmengLength: function(isSelf, length) {
                    var preStr = isSelf ? '我' : 'ta';
                    return preStr + '的绩效被' + length + '人关注';
                },
                mySubordinate: function(isSelf) {
                    var preStr = isSelf ? '我' : 'ta';
                    return preStr + '的下级';
                },
                mySupervisor: function(isSelf) {
                    var preStr = isSelf ? '我' : 'ta';
                    return preStr + '的上级';
                },
            },
            statusList: {
                all: '全部绩效',
                active: '正在进行的绩效',
                close: '已经结束的绩效'
            },
            feedback: '沟通反馈',
            closeCommunicate: '收起',
            personUnit: '人',
            mySelf: '我',
            components: {
                allSelectLabel: '全选',
                submit: '提交',
                reject: '驳回',
                pagination: {
                    prev_text: '前一页',
                    next_text: '后一页'
                },
                grid: {
                    userName: '姓名',
                    activityName: '绩效活动',
                    stepName: '当前步骤',
                    deptName: '所属部门',
                    myRateScore: '我的评分',
                    lastScore: '总分',
                    lastClass: '总等级',
                    stepType: '步骤类型',
                    operation: '操作'
                }
            },
            back: ' 返回',
            status: {
                close: '已结束',
                active: '进行中'
            },

            selfAssessment:'自评',
            backAll: '返回全部',
            levelBar: '等级分布图',
            close: '关闭',
            allText: '全部',
            noData: '暂无数据',
            total: '合计',
            submit: '确定',
            reject: '驳回',
            save: '保存',
            cancel: '取消',
            invaluably: '无法评价',
            edit: '修改',
            operation: {
                "delete": '删除'
            },
            required: '必填',
            scoreUnit: '分',
            selectDefault: '请选择',
            scoreRange: '分值范围',
            forceGrid: {
                rateClassName: '评分等级',
                forceProportion: '强制比例',
                assessmentProportion: '实际比例',
                forceCount: '强制人数',
                assessmentCount: '实际人数',
                dValue: '差值'
            },
            proportion: '比例',
            number: '人数'
        },
        team: {
            pageTitle: '团队绩效',
            teamView: '团队',
            assessmentView: '查看绩效',
            directSubordinate: '直接下级',
            dottedSubordinate:'虚线下级',
            allSubordinate: '所有下级',
            all: '所有',
            allAssessment: '全部绩效活动',
            getPerson: function(len) {
                return '共' + len + '人';
            },
            noPerson: '尚无人员',
            searchColleague: '搜索同事',
            searchPerson: '请输入员工姓名',
            distribution: '查看分布',
            backAll: '返回全部'

        },
        //考核
        evaluation: {
            pageTitle: '第三方评价',
            endTip: '感谢您的参与，该考核已结束!',
            extensionTip: '想要了解绩效管理系统，请点击',
            completeTip: '感谢您的参与，您已完成本次评价!',
            cancelTip: '抱歉，此次评价邀请已被取消！如有疑问请联系绩效管理员',
            commit: '提交评价结果',
            warnDataTip: '请将数据填写完整',
            saveSuccess: '保存成功'

        },
        // 绩效详情页
        assessment: {
            warmDelete:'您确定要删除此项内容吗？',
            weightRange: '权重范围',
            backTodo: '返回绩效待办',
            warnTargetValueTip: '请先填写目标参数！',
            warnNoGoalValTip: '存在目标未填写目标值信息',
            warnNoComplateValTip: '存在目标未填写完成值信息',
            warnWeightGt100: '当前绩效权重超出100%',
            warnWeightLt100: '当前绩效权重不足100%',
            warnModuleWeightGt100: '模块下的权重超出100%.',
            warnModuleWeightLt100: '模块下的权重不足100%.',
            warnLineOutOfRange :function(number){
                return "存在 " + number + " 条目标评分超出分值范围"
            },
            warnGoalRepeat:function(goalName) {
                return '您添加了两个' + goalName + '指标，请删除一个'
            },
            warnModuleWeightGt:function(score){
                return '模块下的权重超出' + score + '%';
            },
            warnModuleWeightLt:function(score){
                return '模块下的权重不足' + score + '%';
            },
            editWeight: '修改权重',
            sureCommit: '确定要继续提交吗？',
            sureNext: '确定继续吗？',
            sureCommitAssessment: '您确定提交此绩效吗？',
            warnSaveRateScore: '请先保存评价数据！',
            warnSaveWeight: '请先保存权重数据！',
            warnSaveData: '请先保存数据！',
            warnOverModuleNotSave: '考核总览还没有保存！',
            warnSignNotSave: '签字确认还没有保存！',
            warnHideSubmitButton :'为符合绩效分布要求，请确认整体等级分布后一并提交',
            warnAddAndSubLimit:function(name){
                return name + '模块超出模块得分限制！';
            },
            pageTitle: '绩效详情',
            copyFromObjective: '从目标管理中复制',
            performanceEnd: '的绩效',
            sureReject: '确定进行驳回操作吗？',
            myPerformance: '我的绩效',
            writeReason: '编写理由',
            watch360Link: '查看360报告',
            nextLink: '下一人',
            commit: '立即提交',
            reject: '驳回',
            prevLink: '上一人',
            thirdFeed: '第三方反馈',
            thirdRate: '他人评价',
            rateScore: '评分',
            rateComment: '评语',
            customRequired:'【必填】',
            thirdRight: function(ownerName) {
                return '第三方评价人看不到' + ownerName + '的得分和评语';
            },
            customTips:function(minCharCount) {
                return '输入内容少于' + minCharCount + '字';
            },
            customLimit:function(minCharCount){
                return '字数要求：' + minCharCount + '~ 4000字';
            },
            //用户信息视图区域
            inviteotherstofeedback: '邀请他人反馈',
            transmitOther: '转交ta的绩效',
            askingdeleteappriseuser: '您确定删除该评价者吗？',
            askingtransmitother: '确定转交ta的绩效吗？',
            sendAppraiserPressSuccess:'催办成功',
            pressAppraiser:'催办',
            deleteAppraiser:'删除',
            askingfeed: {
                titlePre: '邀请其他人对',
                titleSuf: '进行反馈',
                appriUser: '评价人',
                appriContent: '评价内容',
                emailContext: '邮件内容',
                formateEmailContent:function(userName){
                    return '请您帮'+ userName +'的以下考核目标进行评价，你的评价不会纳入评分结果';
                },
                isRate: '是否评分',
                isRateTip: '评价人需要打分,评价不会纳入评分结果',
                isShowType: '是否显示',
                realApprise: '实名评价',
                anonymousApprise: '匿名评价',
                evaluatedPersonAnonymousApprise: '被评价人不可见'
            },
            workflow: {
                begin: '绩效流程',
                end: '结束'
            },
            operationToolbar: {
                btnNewAdd: '新增绩效目标',
                btnNewAddSum:'新增加减分项',
                btnEditAddSum:'编辑加减分项',
                btnBindObject: '绑定已存在目标',
                btnSelectFromObject: '从已有/指标库中选择',
                btnWeightChange: '批量调整权重',
                btnOpenAll: '全部展开',
                btnCloseAll: '全部收起',
                btnFeedBack: '沟通反馈',
                btnScore: '快速评价'
            },
            dialog: {
                copyTo: '复制到',
                copyFromZhibiao: '从指标库中复制',
                copyFromAssessment: '从已有绩效中复制',
                copyTask: '同时复制任务',
                noTarget: '目标库中还没有目标',
                targetNameTip: '您的目标是什么？',
                addSubTip:'请填写加减分项名称',
                weight: '权重',
                name:'名称',
                score:'分数',
                detailDesc:'详细描述',
                dateline: '起止日期',
                module: '所属模块',
                minimumValue: '保底值',
                itemValue: '目标值',
                challengeValue: '挑战值',
                completeValue: '完成值',
                description: '衡量标准',
                descriptionTip: '为衡量是否已成功而达到的标准'

            },
            //绩效模块
            module: {
                addSubModule:'新增',
                fastAddTarget: '快速新增目标',
                noTarget: '暂无绩效目标',
                hasNoRateTarget: '有未评价项，不能保存！',
                score: '模块得分',
                weight: '总权重',
                sortByWeight: '按权重排序',
                sortByTime: '按时间排序',
                sortByCustom: '自定义排序',
                sort: '排序',
                summary: '本模块为自动汇总模块',
                static: function(length) {
                    return '本模块为固定权重，模块内目标权重之和应该为100%，共' + length + '个目标';
                },
                staticA: function(length,score) {
                    return '本模块为固定权重，模块内目标权重之和应该为'+ score +'%，共' + length + '个目标';
                },
                staticB: function(length) {
                    return '共' + length + '个目标';
                },
                normal: function(length) {
                    return '本模块权重为目标之和，共' + length + '个目标';
                },
                no360Result: '无360评价结果'
            },
            //签字确认
            signinfo: {
                reason: '理由',
                signing: '签字确认中...'
            },
            //考核项
            target: {
                emptyTarget: '还没有任何目标，马上新增一个',
                emptyAddSubTarget: '还没有任何加减分项，马上新增一个',
                emptyCustomItem:'还没有任何数据，马上新增一个',
                multiEmptyCustomItem:'没有任何数据',
                rateScore: '单项得分',
                weight: '权重',
                addTask: '添加任务',
                copyTask: '复制任务',
                feedback: '沟通反馈',
                completeValue: '完成值',
                targetValue: '目标值',
                deadline: '截止日期',
                relatedTasks: '相关任务',
                relatedKR: '关键成果',
                sumTasks: '共',
                countTasks: '个任务',
                countTarget: '项关键成果',
                otherFeed: '查看其他反馈',
                otherRate: '查看他人评价',
                frUnit: '条',
                taskName: '任务名称',
                taskDeadline: '何时完成',
                addTaskBtn: '发布',
                editTarget: '编辑目标',
                delteTarget: '删除目标',
                selectEmpty: '请选择',
                copyTaskTitle: '复制已有目标的任务',
                watch: '查看',
                desc: '目标描述',
                hide: '收起',
                deleteTargetTip: '您确定要删除此考核项吗？',
                deleteAddSubTip: '您确定要删除此加减分项吗？'

            },
            //考核总览
            overviewModule: {
                scoreUnit: '分',
                title: '考核总览',
                score: '计算总分',
                finalScore: '最终得分',
                changeScore: '调整总分',
                grade: '总等级',
                comment: '总评语',
                plan: '发展计划',
                gradeInstruction: '总等级说明',
                manualChangeGrade: '手动调整等级',
                forceDistributionGrade: '强制分布等级',
                empty: '暂无'
            },
            objective: {
                All: "全部",
                Year: "年度",
                FirstHalfYear: "上半年",
                SecondHalfYear: "下半年",
                FirstQuarter: "第一季度",
                SecondQuarter: "第二季度",
                ThirdQuarter: "第三季度",
                FourthQuarter: "第四季度",
                January: "1月",
                February: "2月",
                March: "3月",
                April: "4月",
                May: "5月",
                June: "6月",
                July: "7月",
                August: "8月",
                September: "9月",
                October: "10月",
                November: "11月",
                December: "12月",
                Period: '期间',
                InProgerss: '进行中',
                Compoleted: '已完成',
                noData: '目标管理中无数据'
            }
        },
        //我的绩效频道
        myHome: {
            pageTitle: '我的绩效',
            getPageTitle: function(ownerName) {
                return ownerName + '的绩效'
            },
            getPageTitle2: function(isSelf) {
                return isSelf ? '我的绩效' : '他人绩效';
            },
            selectDefaultOption: '全部绩效',
            emptyText: '暂无数据'
        },
        home: {
            isSaveData:'是否保存编辑中的数据',
            pageTitle: '绩效待办',
            noDoneAssessment: '还没有我处理过的绩效',
            noDoneAssessment2: '我处理过的绩效会出现在这里',
            todo: '待办',
            done: '已办',
            myTodo: '我的待办',
            myDone: '我的已办',
            emptyTodo: '恭喜您已处理完所有待办事项',
            allText: '全部',
            filterTip: '系统将自动跳过未评价的',
            //步骤名称
            allStep: {
                0: "已结束",
                1: "制定目标",
                2: "待评估",
                4: "签字确认",
                5: "待审批",
                //5: "审核通过",
                6: "多人评估邀请",
                7: "hr审核"
            },
            message: {
                submitFailure: '提交失败！',
                emptySocre: '所选的人员没有评分',
                noselectedUser: '请先选择人员！',
                vaildError:'填写有误，请检查'
            },
            sureRateCommit: '确认要提交评价结果吗',
            sureApprovalCommit: '确认要提交审批结果吗',
            watchDistribution: ' 查看比例分布',
            groupModify:'批量调整',
            saveModify:'保存',
            allReslove:'全部审核通过',
            reslove: '审核通过',
            allCommit:'全部提交',
            commit: '提交',
            approved : '已审批通过:',
            unApproved : '未提交审批:',
            searchResult: '搜索结果：共',
            unit :'人',
            //组件
            components: {
                viewForcedResult: '查看比例分布',
                searchDept: '搜索部门',
                grid: {
                    userName: '姓名',
                    activityName: '绩效活动',
                    stepName: '当前步骤',
                    deptName: '所属部门',
                    myRateScore: '我的评分',
                    lastScore: '总分',
                    lastClass: '总等级',
                    operation: '操作',
                    doneContent: '处理内容',
                    doneTime: '处理时间',
                    moduleScore: '模块得分'

                },
                emptyText: '很抱歉，没有符合条件的信息，请尝试其他查询'
            }

        }
    };
});