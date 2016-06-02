import Vue from './vue'

Vue.component('calendar', {
    template: '#calendar-template',
    props: [],
    data () {
        return {
            show: false,
            toDay: new Date(),
            selectedYear: new Date().getFullYear(),
            selectedMonth: new Date().getMonth() + 1,
            weeks: ['日', '一', '二', '三', '四', '五', '六'],
            days: [],
            classPassDay: 'pass-day',
            userSelecteDate: new Date().toLocaleDateString()
        }
    },
    // 实例创建之后同步调用  http://vuejs.org.cn/api/#created
    created () {
      this.processDays();  
    },
    
    methods: {
        dateAddMethod () {
            if(this.selectedMonth + 1 != 13) {
                this.selectedMonth += 1;
            } else {
                this.selectedYear += 1;
                this.selectedMonth = 1;
            }
            this.processDays();
        },
        dateLesMethod () {
            if(this.selectedMonth - 1 != 0) {
                this.selectedMonth -= 1;
            } else {
                this.selectedYear -= 1;
                this.selectedMonth = 12;
            }
            this.processDays();
        },
        processDays () {
            this.days = [];
            var selecteDay = new Date(this.selectedYear, this.selectedMonth-1, 1),
                monthTip = selecteDay.getMonth();
            for(let i = 0; i < 6; i++) {
                this.days[i] = [];
                for(let j = 0; j < 7; j++) {
                    if(selecteDay.getDay() == j && selecteDay.getMonth() == monthTip) {
                        if((selecteDay - this.toDay) < -86400000) {
                            this.days[i].push({day: selecteDay.getDate(), isBelow: true});
                        } else {
                            this.days[i].push({day: selecteDay.getDate(), isBelow: false});
                        }
                        selecteDay.setDate(selecteDay.getDate() + 1);
                    } else {
                        this.days[i].push('');
                    }
                }
            }
        },
        clickDay (event) {
            var target = event.target;
            if(target.textContent.trim()) {
                var day = target.textContent.trim(),
                    month = this.selectedMonth,
                    year = this.selectedYear,
                    date = new Date(year, month - 1, day);
                console.log(date.toLocaleDateString());
                this.userSelecteDate = date.toLocaleDateString();
                this.show = false;
            }
        },
        mouseoverDay (event) {
            var target = event.target;
            if(target.textContent.trim()) {
                target.classList.add('day-td');
            }
            target.addEventListener('mouseout', (event) => {
                event.target.classList.remove('day-td');
            })
        }
    }
});

new Vue({
    el: '#app'
})
