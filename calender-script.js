currentDate = new Date()
document.addEventListener('DOMContentLoaded', function () {
    if (document.querySelectorAll('.date-input-container')) {
        document.querySelectorAll('.date-input-container').forEach(ele => {
            var parentEle = ele.closest('.wf-field-inner'),
                dateField = parentEle.querySelector('#date_field'),
                dateFormat = dateField.getAttribute('placeholder'),
                calenderIcon = ele.querySelector('.calendar-icon'),
                prevMonth = document.getElementById('prevMonth'),
                nextMonth = document.getElementById('nextMonth'),
                prevYear = document.getElementById('prevYear'),
                nextYear = document.getElementById('nextYear'),
                yearObj = { placeholder: dateFormat.indexOf('YYYY') > -1 ? 'YYYY' : 'YY', maxLength: dateFormat.indexOf('YYYY') > -1 ? 4 : 2, width: '62px', id: 'yearInput', type: 'year' },
                monthObj = { placeholder: dateFormat.indexOf('MM') > -1 ? 'MM' : 'M', maxLength: 2, width: '46px', id: 'monthInput', type: 'month' },
                dayObj = { placeholder: dateFormat.indexOf('DD') > -1 ? 'DD' : 'D', maxLength: 2, width: '42px', id: 'dayInput', type: 'day' };
            if (['YYYY/MM/DD'].includes(dateFormat)) {
                setInputsForDateFormat(ele, [yearObj, monthObj, dayObj], getSeparators(dateFormat))
            } else if (['MM/DD/YYYY', 'MM-DD-YYYY', 'MM.DD.YYYY', 'MM DD YYYY'].includes(dateFormat)) {
                setInputsForDateFormat(ele, [monthObj, dayObj, yearObj], getSeparators(dateFormat))
            } else if (['DD/MM/YY', "DD-MM-YYYY", "DD/MM/YYYY", "DD.MM.YYYY", "DD MM YYYY", "DD-MM-YY", "DD.MM.YY", "D.MM.YY", "D-M-YY", "D/M/YY", "D.M.YY", "D-M-YYYY"].includes(dateFormat)) {
                setInputsForDateFormat(ele, [dayObj, monthObj, yearObj], getSeparators(dateFormat));
            }

            calenderIcon.addEventListener('click', function() {
                if (calendar.style.display === 'none' || calendar.style.display === '') {
                    openCalendar(ele);
                } else {
                    closeCalendar();
                }
            });
        })
        prevMonth.addEventListener('click', function() {
            currentDate.setMonth(currentDate.getMonth() - 1);
            renderCalendar(currentDate);
        });
    
        nextMonth.addEventListener('click', function() {
            currentDate.setMonth(currentDate.getMonth() + 1);
            renderCalendar(currentDate);
        });

        prevYear.addEventListener('click', function() {
            currentDate.setFullYear(currentDate.getFullYear() - 1);
            renderCalendar(currentDate);
        });
    
        nextYear.addEventListener('click', function() {
            currentDate.setFullYear(currentDate.getFullYear() + 1);
            renderCalendar(currentDate);
        });
        function setInputsForDateFormat(ele, formatObj, separator) {
            var inputs = ele.querySelectorAll('.wf-field-item-date')
            formatObj.map((obj, index) => {
                inputs[index].id = obj.id;
                inputs[index].placeholder = obj.placeholder;
                inputs[index].style.width = obj.width;
                inputs[index].dataset.type = obj.type;
    
                validateAndFormatInput(inputs[index], obj.maxLength, obj.type, inputs[index + 1], inputs[index - 1]);
            })
            ele.querySelectorAll('.separator').forEach(x => x.innerHTML = separator);
            function validateAndFormatInput(input, max, type, nextInput, prevInput) {
                input.addEventListener('input', function () {
                    let value = this.value.replace(/\D/g, '');
    
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
    
                    if (value != "0" && value.length === 1 && max === 2) {
                        value = '0' + value;
                    }
                    if (type == 'year' && value.length > max) {
                        value = value.substring(0, max);
                    }
    
                    this.value = value;
    
                    // Move focus to the next input if max length is reached
                    if (value.length === max && nextInput && ((type === 'day' && parseInt(value) > 3) || (type === 'month' && parseInt(value) > 1))) {
                        nextInput.focus();
                    }
    
                });
                input.addEventListener('blur', function () {
                    let value = this.value;
    
                    // Pad the value with leading zero if necessary
                    if (value.length === 1 && max === 2) {
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
        function openCalendar(ele) {
            var monthValue = '', dayValue = '', yearValue = '';
            ele.querySelectorAll('.wf-field-item-date').forEach(x => {
                if (x.dataset.type == 'day') {
                    dayValue = x.value;
                } else if (x.dataset.type == 'month') {
                    monthValue = x.value
                } else {
                    yearValue = x.value
                }
            })
            if (yearValue && monthValue && dayValue) {
                currentDate = new Date(parseInt(yearValue), parseInt(monthValue) - 1, parseInt(dayValue));  // Set the calendar to the input date
            }
            calendar.style.display = 'block';
            calendar.style.top = `${ele.querySelector('.wf-field-item-date').getBoundingClientRect().bottom + window.scrollY + 5}px`;
            calendar.style.left = `${ele.querySelector('.wf-field-item-date').getBoundingClientRect().left + window.scrollX}px`;
            renderCalendar(currentDate);
        }
    
        function closeCalendar() {
            calendar.style.display = 'none';
        }
        function renderCalendar(date) {
            calendarBody.innerHTML = '';
            const year = date.getFullYear();
            const month = date.getMonth();
    
            // Set month and year header
            monthYear.textContent = `${date.toLocaleString('default', { month: 'long' })} ${year}`;
    
            // Get the first day of the month
            const firstDay = new Date(year, month, 1).getDay();
            const lastDate = new Date(year, month + 1, 0).getDate();
    
            // Fill the calendar with days
            for (let i = 0; i < firstDay; i++) {
                const emptyCell = document.createElement('div');
                calendarBody.appendChild(emptyCell);
            }
    
            for (let day = 1; day <= lastDate; day++) {
                const dateCell = document.createElement('div');
                const dateObj = new Date(year, month, day);
                const dayOfWeek = dateObj.getDay();
    
                dateCell.classList.add('calendar-date');
                dateCell.textContent = day;
    
                // Highlight the prepopulated date
                if (day === date.getDate() && year === date.getFullYear() && month === date.getMonth()) {
                    dateCell.classList.add('selected');  // Highlight the selected date
                }
    
                // Check if the day is restricted (e.g., Monday or Tuesday)
                if (dayOfWeek === 1 || dayOfWeek === 2) {  // 1 = Monday, 2 = Tuesday
                    dateCell.classList.add('disabled-date');  // Add a disabled class for styling
                } else {
                    dateCell.addEventListener('click', function() {
                        dateInput.value = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                        closeCalendar();
                    });
                }
    
                calendarBody.appendChild(dateCell);
            }
        }
    
    }
});
// function openDatePicker(ele) {
//     var parentEle = ele.closest('.wf-field-inner')
//     textField = parentEle.querySelector('.custom-date-converted-field'),
//         dateField = parentEle.querySelector('#date_field');
//     if (textField.dataset.openPicker == 'false') {
//         textField.dataset.openPicker = 'true'
//         return
//     }
//     document.querySelectorAll('input[type=date]~.custom-date-converted-field[data-open-picker=false]').forEach(x => x.dataset.openPicker = true)
//     textField.dataset.openPicker = 'false';
//     if (textField.value) {
//         let dateFormat = textField.getAttribute('placeholder'),
//             dateIndex = 0,
//             monthIndex = 1,
//             yearIndex = 2,
//             separator = getSeparators(dateFormat), year_2;

//         let dateArray = textField.value.split(separator);
//         if (['YYYY/MM/DD'].includes(dateFormat)) {
//             yearIndex = 0;
//             monthIndex = 1;
//             dateIndex = 2;
//         } else if (['MM/DD/YYYY', 'MM-DD-YYYY', 'MM.DD.YYYY', 'MM DD YYYY'].includes(dateFormat)) {
//             monthIndex = 0;
//             dateIndex = 1;
//             yearIndex = 2;
//         } else if (['DD/MM/YY'].includes(dateFormat)) {
//             dateIndex = 0;
//             monthIndex = 1;
//             yearIndex = 2;
//             year_2 = getCorrectYear(parseInt(dateArray[yearIndex])) //.substring(0,2)
//             dateArray[yearIndex] = year_2;
//         }
//         dateField.value = `${dateArray[yearIndex]}-${dateArray[monthIndex]}-${dateArray[dateIndex]}`
//     }
//     dateField.showPicker()
//     dateField.focus();
// }
// function getCorrectYear(year) {
//     if ((year + '').length != 2) {
//         return year
//     }
//     var cur_Year = (new Date).getFullYear(),
//         year_prefix = parseInt(cur_Year / 100),
//         year_suffix = cur_Year % 100,
//         limit = (year_suffix - lLimit + 100) % 100;
//     if (year_suffix > limit) {
//         if (year < limit) {
//             year = year_prefix + 1 + '' + year
//         } else {
//             year = year_prefix + '' + year
//         }
//     } else if (year < limit) {
//         year = year_prefix + '' + year
//     } else {
//         year = year_prefix - 1 + '' + year
//     }
//     return year
// }
function getSeparators(dateFormat) {
    var availableSeparators = ['/', '-', '.', ' '],
        separator = '/';
    for (const item of availableSeparators) {
        if (dateFormat.includes(item)) {
            separator = item;
            break;
        }
    }
    return separator
}
// function getDisplayValueForDateFields(event) {
//     // Create an Intl.DateTimeFormat object for year, month, and day with a custom locale and options
//     //Available values 'numeric', '2-digit', 'short', 'long'
//     //For single digit month use new Date().getMonth() + 1; for single digit date - new Date().getDate()

//     let format = event.getAttribute('placeholder'),
//         yearConvertValue = 'numeric',
//         monthConvertValue = '2-digit',
//         dayConvertValue = '2-digit',
//         endValue = '';

//     if (format == 'DD/MM/YY') {
//         yearConvertValue = '2-digit'
//     }
//     const yearFormatter = new Intl.DateTimeFormat('en-US', { year: yearConvertValue });
//     const monthFormatter = new Intl.DateTimeFormat('en-US', { month: monthConvertValue });
//     const dayFormatter = new Intl.DateTimeFormat('en-US', { day: dayConvertValue });
//     if (event.value) {
//         var year = yearFormatter.format(new Date(event.value)),
//             month = monthFormatter.format(new Date(event.value)),
//             day = dayFormatter.format(new Date(event.value)),
//             separator = getSeparators(format);
//         if (['MM/DD/YYYY', 'MM-DD-YYYY', 'MM.DD.YYYY', 'MM DD YYYY'].includes(format)) {
//             endValue = `${month}${separator}${day}${separator}${year}`
//         } else if (['DD/MM/YY'].includes(format)) {
//             endValue = `${day}${separator}${month}${separator}${year}`
//         }
//     }
//     event.nextElementSibling.value = endValue;
// }