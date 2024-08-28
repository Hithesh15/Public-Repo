var currentDate = new Date(),
    selectedDateField,
    shortMonth = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"],
    longMonth = ["january", "february", "march", "april", "may", "june", "july", "august", "september", "october", "november", "december"],
    calendar = document.querySelector('#wf-calender-popup'),
    prevYear = document.querySelector('#wf-calendar-prevYear-icon'),
    prevMonth = document.querySelector('#wf-calendar-prevMonth-icon'),
    nextMonth = document.querySelector('#wf-calendar-nextMonth-icon'),
    nextYear = document.querySelector('#wf-calendar-nextYear-icon'),
    monthYear = document.querySelector('#wf-calendar-monthYear'),
    calendarBody = document.querySelector('#wf-calendar-body'),
    dummyEle = document.querySelector('.dummy-div')
    minDate = new Date(2023, 0, 1),
    maxDate = new Date(2025, 11, 31);
    // 0 - Sunday 1 = Monday, 2 = Tuesday, 3 - Wednesday, 4 - Thursday, 5 - Friday, 6 - Saturday
    weekStartDay = 2;
    // function getAllMonthsFull() {
    //     var months = [];
    //     for (let i = 0; i < 12; i++) {
    //         months.push(new Date(2024, i, 1).toLocaleString('fr-FR', { month: 'long' }).toLowerCase());
    //     }
    //     return months;
    // }
    // function getAllMonthsShort() {
    //     var months = [];
    //     for (let i = 0; i < 12; i++) {
    //         months.push(new Date(2024, i, 1).toLocaleString('fr-FR', { month: 'short' }).toLowerCase());
    //     }
    //     return months;
    // }
document.addEventListener('DOMContentLoaded', function () {
    if (document.querySelectorAll('.date-input-container')) {
        document.querySelectorAll('.date-input-container').forEach(ele => {
            var dateFormat = ele.dataset.format,
                yearObj = { placeholder: dateFormat.indexOf('YYYY') > -1 ? 'YYYY' : 'YY', maxLength: dateFormat.indexOf('YYYY') > -1 ? 4 : 2, maxWidth: dateFormat.indexOf('YYYY') > -1 ? '40px' : '20px', id: 'yearInput', type: 'year' },
                monthObj = getMonthObj(dateFormat)
            dayObj = { placeholder: dateFormat.indexOf('DD') > -1 ? 'DD' : 'D', maxLength: 2, maxWidth: dateFormat.indexOf('DD') > -1 ? '21px' : '16px', id: 'dayInput', type: 'day' };
            if (['YYYY/MM/DD', 'YYYY-MM-DD', 'YYYY.MM.DD', 'YYYY MM DD', 'YY/MM/DD', 'YY-MM-DD', 'YY.M.D', 'YY-M-D', 'YY. M. D', 'YYYY/M/D', 'YYYY年MM月DD日', 'YY年M月D日', 'YYYY.MM.DD.', 'YYYY. MM. DD', 'YYYY.DD.MM', 'YY.D.M'].includes(dateFormat)) {
                setInputsForDateFormat(ele, [yearObj, monthObj, dayObj], getSeparators(dateFormat))
            } else if (['MM/DD/YYYY', 'MM-DD-YYYY', 'MM.DD.YYYY', 'MM DD YYYY', 'MMMM D, YYYY', 'MMM-DD-YYYY', 'MMM D, YYYY', 'MM-DD-YY', 'MM/DD/YY', 'M/DD/YY', 'MMM DD, YYYY'].includes(dateFormat)) {
                setInputsForDateFormat(ele, [monthObj, dayObj, yearObj], getSeparators(dateFormat))
            } else if (['DD/MM/YY', "DD-MM-YYYY", "DD/MM/YYYY", "DD.MM.YYYY", "DD MM YYYY", "DD-MM-YY", "DD.MM.YY", "D.MM.YY", "D-M-YY", "D/M/YY", "D.M.YY", "D-M-YYYY", "DD MMM, YYYY", "D.M.YY.", "D/M/YYYY", "D.M.YYYY", "D. M. YYYY.", "D. M. YYYY", "D MMM, YYYY", "D. MMMM YYYY", "DD.MM.YYYY.", "DD.MM.YY."].includes(dateFormat)) {
                setInputsForDateFormat(ele, [dayObj, monthObj, yearObj], getSeparators(dateFormat));
            }

            ele.addEventListener('click', function () {
                if (calendar.style.display === 'none' || calendar.style.display === '' || event.target.classList.contains('wf-field-item-date')) {
                    selectedDateField = ele
                    openCalendar();
                } else {
                    selectedDateField = null
                    closeCalendar();
                }
            });
        })
        prevMonth.addEventListener('click', function () {
            event.stopPropagation()
            currentDate.setMonth(currentDate.getMonth() - 1);
            renderCalendar(currentDate);
        });

        nextMonth.addEventListener('click', function () {
            currentDate.setMonth(currentDate.getMonth() + 1);
            renderCalendar(currentDate);
        });

        prevYear.addEventListener('click', function () {
            currentDate.setFullYear(currentDate.getFullYear() - 1);
            renderCalendar(currentDate);
        });

        nextYear.addEventListener('click', function () {
            currentDate.setFullYear(currentDate.getFullYear() + 1);
            renderCalendar(currentDate);
        });

        function getMonthObj(dateFormat) {
            var maxWidth = '', placeholder = 'M', maxLength = 2, isString = false, minWidth = '',width='';
            if (dateFormat.indexOf('MMMM') > -1) {
                placeholder = 'MMMM';
                maxLength = 9;
                isString = true;
                maxWidth = "75px";
                width = '50px'
            } else if (dateFormat.indexOf('MMM') > -1) {
                placeholder = 'MMM'
                maxLength = 3;
                isString = true;
                width = maxWidth = '37px';
                minWidth = '20px';
            } else if (dateFormat.indexOf('MM') > -1) {
                placeholder = 'MM';
                maxWidth = '25px'
            } else {
                maxWidth = '16px'
            }
            return { placeholder: placeholder, maxLength: maxLength, maxWidth: maxWidth, minWidth: minWidth, width: width, id: 'monthInput', type: 'month', isString: isString }
        }
        function setInputsForDateFormat(ele, formatObj, separators) {
            var inputs = ele.querySelectorAll('.wf-field-item-date')
            formatObj.map((obj, index) => {
                inputs[index].id = obj.id;
                inputs[index].placeholder = obj.placeholder;
                inputs[index].style.maxWidth = obj.maxWidth;
                inputs[index].dataset.type = obj.type;
                if (obj.isString) {
                    inputs[index].maxLength = obj.maxLength
                    inputs[index].style.minWidth = obj.minWidth
                    inputs[index].style.width = obj.width
                }

                validateAndFormatInput(inputs[index], obj.maxLength, obj.type, inputs[index + 1], inputs[index - 1], obj);
            })
            ele.querySelectorAll('.separator').forEach((x, index) => x.innerHTML = separators[index]);
            function validateAndFormatInput(input, max, type, nextInput, prevInput, obj) {
                input.addEventListener('input', function () {

                    if (this.value.length == max) {
                        openCalendar()
                    }

                    let value = this.value.replace(/\D/g, '');
                    if (obj.isString) {
                        this.value = this.value.replace(/[^a-zA-Z\s]/g, '');
                        if (this.value && this.value.length == max && nextInput) {
                            nextInput.focus()
                        }
                        if(this.value) {
                            dummyEle.innerHTML = this.value
                            this.style.width = dummyEle.offsetWidth + 5 + 'px'
                        } else {
                            this.style.width = obj.width
                        }
                        return
                    }

                    // Validate input based on its type
                    if (type === 'day' && parseInt(value) > 31) {
                        value = '31';
                    }
                    if (type === 'month' && parseInt(value) > 12) {
                        value = '12';
                    }
                    if (value) {
                        value = parseInt(value) + ''
                    }

                    if (value != "0" && value.length === 1 && max === 2 && !['D', 'M', 'YY'].includes(this.placeholder)) {
                        value = '0' + value;
                    }
                    if (type == 'year' && value.length > max) {
                        value = value.substring(0, max);
                    }

                    this.value = value;

                    // Move focus to the next input if max length is reached
                    if ((value.length === max || ['D', 'M'].includes(this.placeholder)) && nextInput && ((type === 'day' && parseInt(value) > 3) || (type === 'month' && parseInt(value) > 1) || (type == 'year' && this.value.length == max))) {
                        nextInput.focus();
                    }

                });
                input.addEventListener('blur', function () {
                    let value = this.value;

                    // Pad the value with leading zero if necessary
                    if (value.length === 1 && max === 2 && !['D', 'M'].includes(this.placeholder)) {
                        this.value = '0' + value;
                    }
                });
                input.addEventListener('keydown', function (e) {
                    if (e.key === 'Backspace' && this.value === '' && prevInput) {
                        prevInput.focus();
                    }
                });
            }
        }
        function openCalendar() {
            if (selectedDateField) {
                var monthValue = '', dayValue = '', yearValue = '';
                selectedDateField.querySelectorAll('.wf-field-item-date').forEach(x => {
                    if (x.dataset.type == 'day') {
                        dayValue = x.value;
                    } else if (x.dataset.type == 'month') {
                        monthValue = x.value
                        if (x.placeholder == 'MMM' || x.placeholder == 'MMMM') {
                            monthValue = getMonthValue(x.value, x.placeholder == 'MMM' ? shortMonth : longMonth)
                        }
                    } else {
                        yearValue = x.value
                        if (x.placeholder == 'YY') {
                            yearValue = getCorrectYear(x.value)
                        }
                    }
                })
                if (yearValue && monthValue && dayValue) {
                    currentDate = new Date(parseInt(yearValue), parseInt(monthValue) - 1, parseInt(dayValue));  // Set the calendar to the input date
                } else {
                    currentDate = new Date()
                }
                renderCalendar(currentDate);
            }
        }

        function getMonthValue(value, monthArr) {
            var month = ''
            if (monthArr.indexOf(value.toLowerCase()) > -1) {
                month = monthArr.indexOf(value.toLowerCase()) + 1 + ''
            }
            return month
        }

        function closeCalendar() {
            calendar.style.display = 'none';
        }
        function renderCalendar(date) {
            calendarBody.innerHTML = '';
            const year = date.getFullYear(),
            month = date.getMonth(),
            dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
            firstDayOfMonth = new Date(year, month, 1).getDay(),
            adjustedFirstDay = (firstDayOfMonth - weekStartDay + 7) % 7, // Adjust for the custom week start day
            lastDate = new Date(year, month + 1, 0).getDate(),
            adjustedDayNames = dayNames.slice(weekStartDay).concat(dayNames.slice(0, weekStartDay));
            

            // Set month and year header
            monthYear.textContent = `${date.toLocaleString('default', { month: 'long' })} ${year}`;

            adjustedDayNames.map((day,index) => calendar.querySelectorAll('.wf-calendar-days')[index].innerHTML = day);

            // Fill the calendar with days
            for (let i = 0; i < adjustedFirstDay; i++) {
                const emptyCell = document.createElement('div');
                calendarBody.appendChild(emptyCell);
            }

            for (let day = 1; day <= lastDate; day++) {
                const dateCell = document.createElement('div');
                const dateObj = new Date(year, month, day);
                const dayOfWeek = dateObj.getDay();

                dateCell.classList.add('wf-calendar-date');
                dateCell.textContent = day;

                // Highlight the current date
                if (day === new Date().getDate() && month === new Date().getMonth() && year === new Date().getFullYear()) {
                    dateCell.classList.add('current-date');
                }

                // Highlight the selected date
                if (day === date.getDate() && year === date.getFullYear() && month === date.getMonth()) {
                    dateCell.classList.add('selected');
                }

                // Check if the day is restricted (e.g., Monday or Tuesday) or min max validations or restrict past or restrict future dates
                // 0 - Sunday 1 = Monday, 2 = Tuesday, 3 - Wednesday, 4 - Thursday, 5 - Friday, 6 - Saturday
                if ([0, 6].includes(dayOfWeek) /* || dateObj < minDate || dateObj > maxDate  || dateObj > new Date()|| dateObj > new Date()*/) {
                    dateCell.classList.add('disabled-date');
                } else {
                    dateCell.addEventListener('click', function () {
                        selectedDateField.querySelectorAll('.wf-field-item-date').forEach(x => {
                            if (x.dataset.type == 'day') {
                                x.value = String(day).padStart(2, '0');
                                if (x.placeholder = 'D') {
                                    x.value = String(day);
                                }
                            } else if (x.dataset.type == 'month') {
                                x.value = String(month + 1).padStart(2, '0');
                                if (x.placeholder == 'MMM') {
                                    x.value = shortMonth[month]
                                    // x.style.width = '27px'
                                    dummyEle.innerHTML = x.value
                                    x.style.width = dummyEle.offsetWidth + 5 + 'px'
                                } else if (x.placeholder == 'MMMM') {
                                    x.value = longMonth[month]
                                    dummyEle.innerHTML = x.value
                                    x.style.width = dummyEle.offsetWidth + 5 + 'px'
                                } else if (x.placeholder == 'M') {
                                    x.value = String(month + 1);
                                }
                            } else {
                                if (x.placeholder == 'YY') {
                                    x.value = (year + '').substring(2, 4);
                                } else {
                                    x.value = year
                                }
                            }
                        })
                        closeCalendar();
                    });
                }

                calendarBody.appendChild(dateCell);
            }
            calendar.style.display = 'block';
            positionCalendar()
        }

    }
});

function positionCalendar() {
        
        const wrapperRect = document.querySelector('.wf-form-component').getBoundingClientRect();
        const position = selectedDateField.getBoundingClientRect();
        const spaceBelow = window.innerHeight - position.bottom;

        if (spaceBelow >  calendar.offsetHeight) {
            calendar.style.bottom = `${wrapperRect.bottom - position.bottom - calendar.offsetHeight - 5}px`
            calendar.style.top = '';
        } else {
            calendar.style.top = `${Math.abs(position.top - wrapperRect.top - calendar.offsetHeight - 5)}px`
            calendar.style.bottom = '';
        }
    // // Check if there's enough space below the target element
    // if (bottom < calendar.offsetHeight) {
    //     calendar.style.top = `${top - calendar.offsetHeight - selectedDateField.offsetHeight}px`;
    // } else {
    //     calendar.style.top = `${top}px`;
    // }

    // Position based on text direction
    if (document.dir == 'rtl') {
        calendar.style.right = `${Math.abs(position.right - wrapperRect.right)}px`;
    } else {
        calendar.style.left = `${Math.abs(position.left - wrapperRect.left)}px`;
    }
}
function getCorrectYear(year) {
    if ((year + '').length != 2) {
        return year
    }
    var cur_Year = (new Date).getFullYear(),
        year_prefix = parseInt(cur_Year / 100),
        year_suffix = cur_Year % 100,
        limit = (year_suffix - lLimit + 100) % 100;
    if (year_suffix > limit) {
        if (year < limit) {
            year = year_prefix + 1 + '' + year
        } else {
            year = year_prefix + '' + year
        }
    } else if (year < limit) {
        year = year_prefix + '' + year
    } else {
        year = year_prefix - 1 + '' + year
    }
    return year
}
function getSeparators(dateFormat) {
    var separators = [];
    const regexPattern1 = /\. /g;
    if (regexPattern1.test(dateFormat)) {
        separators = dateFormat.match(regexPattern1)
    } else {
        separators = dateFormat.match(/[^a-zA-Z0-9]/g)
    }
    if (separators.length == 1) {
        separators = dateFormat.match(/[^a-zA-Z0-9]/g)
    }
    return separators
}