'use strict';

// Динамический адаптив

function DynamicAdapt(type) {
    this.type = type;
}
DynamicAdapt.prototype.init = function () {
    const _this = this;
    this.оbjects = [];
    this.daClassname = '_dynamic_adapt_';
    this.nodes = document.querySelectorAll('[data-da]');
    for (let i = 0; i < this.nodes.length; i++) {
        const node = this.nodes[i];
        const data = node.dataset.da.trim();
        const dataArray = data.split(',');
        const оbject = {};
        оbject.element = node;
        оbject.parent = node.parentNode;
        оbject.destination = document.querySelector(dataArray[0].trim());
        оbject.breakpoint = dataArray[1] ? dataArray[1].trim() : '767';
        оbject.place = dataArray[2] ? dataArray[2].trim() : 'last';
        оbject.index = this.indexInParent(оbject.parent, оbject.element);
        this.оbjects.push(оbject);
    }
    this.arraySort(this.оbjects);
    this.mediaQueries = Array.prototype.map.call(
        this.оbjects,
        function (item) {
            return '(' + this.type + '-width: ' + item.breakpoint + 'px),' + item.breakpoint;
        },
        this
    );
    this.mediaQueries = Array.prototype.filter.call(this.mediaQueries, function (item, index, self) {
        return Array.prototype.indexOf.call(self, item) === index;
    });
    for (let i = 0; i < this.mediaQueries.length; i++) {
        const media = this.mediaQueries[i];
        const mediaSplit = String.prototype.split.call(media, ',');
        const matchMedia = window.matchMedia(mediaSplit[0]);
        const mediaBreakpoint = mediaSplit[1];
        const оbjectsFilter = Array.prototype.filter.call(this.оbjects, function (item) {
            return item.breakpoint === mediaBreakpoint;
        });
        matchMedia.addListener(function () {
            _this.mediaHandler(matchMedia, оbjectsFilter);
        });
        this.mediaHandler(matchMedia, оbjectsFilter);
    }
};
DynamicAdapt.prototype.mediaHandler = function (matchMedia, оbjects) {
    if (matchMedia.matches) {
        for (let i = 0; i < оbjects.length; i++) {
            const оbject = оbjects[i];
            оbject.index = this.indexInParent(оbject.parent, оbject.element);
            this.moveTo(оbject.place, оbject.element, оbject.destination);
        }
    } else {
        for (let i = оbjects.length - 1; i >= 0; i--) {
            const оbject = оbjects[i];
            if (оbject.element.classList.contains(this.daClassname)) {
                this.moveBack(оbject.parent, оbject.element, оbject.index);
            }
        }
    }
};
DynamicAdapt.prototype.moveTo = function (place, element, destination) {
    element.classList.add(this.daClassname);
    if (place === 'last' || place >= destination.children.length) {
        destination.insertAdjacentElement('beforeend', element);
        return;
    }
    if (place === 'first') {
        destination.insertAdjacentElement('afterbegin', element);
        return;
    }
    destination.children[place].insertAdjacentElement('beforebegin', element);
};
DynamicAdapt.prototype.moveBack = function (parent, element, index) {
    element.classList.remove(this.daClassname);
    if (parent.children[index] !== undefined) {
        parent.children[index].insertAdjacentElement('beforebegin', element);
    } else {
        parent.insertAdjacentElement('beforeend', element);
    }
};
DynamicAdapt.prototype.indexInParent = function (parent, element) {
    const array = Array.prototype.slice.call(parent.children);
    return Array.prototype.indexOf.call(array, element);
};
DynamicAdapt.prototype.arraySort = function (arr) {
    if (this.type === 'min') {
        Array.prototype.sort.call(arr, function (a, b) {
            if (a.breakpoint === b.breakpoint) {
                if (a.place === b.place) {
                    return 0;
                }

                if (a.place === 'first' || b.place === 'last') {
                    return -1;
                }

                if (a.place === 'last' || b.place === 'first') {
                    return 1;
                }

                return a.place - b.place;
            }

            return a.breakpoint - b.breakpoint;
        });
    } else {
        Array.prototype.sort.call(arr, function (a, b) {
            if (a.breakpoint === b.breakpoint) {
                if (a.place === b.place) {
                    return 0;
                }

                if (a.place === 'first' || b.place === 'last') {
                    return 1;
                }

                if (a.place === 'last' || b.place === 'first') {
                    return -1;
                }

                return b.place - a.place;
            }

            return b.breakpoint - a.breakpoint;
        });
        return;
    }
};
const da = new DynamicAdapt('max');
da.init();

const isMobile = {
    Android: function () {
        return navigator.userAgent.match(/Android/i);
    },
    BlackBerry: function () {
        return navigator.userAgent.match(/BlackBerry/i);
    },
    iOS: function () {
        return navigator.userAgent.match(/iPhone|iPad|iPod/i);
    },
    Opera: function () {
        return navigator.userAgent.match(/Opera Mini/i);
    },
    Windows: function () {
        return navigator.userAgent.match(/IEMobile/i);
    },
    any: function () {
        return isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows();
    },
};

// Бургер
const iconMenu = document.querySelector('.menu-burger__icon');
const menuBody = document.querySelector('.header__menu-burger');

if (iconMenu) {
    iconMenu.addEventListener('click', function (e) {
        document.body.classList.toggle('_lock');
        iconMenu.classList.toggle('_active');
        menuBody.classList.toggle('_active');
    });
}

// Спойлеры

document.addEventListener('DOMContentLoaded', function () {
    const programLessonsElements = document.querySelectorAll('.program__lessons');
    
    programLessonsElements.forEach(function (programLessonsElement) {
        const lessonElements = programLessonsElement.querySelectorAll('.program__lesson');
        
        lessonElements.forEach(function (lessonElement) {
            const showMoreButton = lessonElement.querySelector('.lesson-program__show-more');
            const detailElement = lessonElement.querySelector('.lesson-program__detail');

            showMoreButton.addEventListener('click', function (event) {
                if (programLessonsElement.classList.contains('one')) {
                    lessonElements.forEach(function (otherLessonElement) {
                        if (otherLessonElement !== lessonElement) {
                            otherLessonElement.classList.remove('active');
                            const otherDetailElement = otherLessonElement.querySelector('.lesson-program__detail');
                            if (otherDetailElement) {
                                otherDetailElement.style.display = 'none';
                            }
                        }
                    });
                }
                
                lessonElement.classList.toggle('active');
                showMoreButton.classList.toggle('active');
                detailElement.classList.toggle('active');
                
                const rotateDeg = lessonElement.classList.contains('active') ? '180deg' : '0deg';
                showMoreButton.style.transition = 'transform 0.3s ease';
                showMoreButton.style.transform = `rotate(${rotateDeg})`;
            });
        });
    });
});

// Функция для анимированной прокрутки к элементу
function scrollToElement(elementId, duration) {
    const targetElement = document.querySelector(elementId);

    if (!targetElement) {
        console.error(`Элемент с идентификатором ${elementId} не найден.`);
        return;
    }

    const startPosition = window.pageYOffset;
    const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset
    const distance = targetPosition - startPosition;
    const startTime = performance.now();

    function animateScroll(currentTime) {
        const elapsedTime = currentTime - startTime;
        const progress = Math.min(elapsedTime / duration, 1);
        const ease = easeOutCubic(progress);
        window.scrollTo(0, startPosition + distance * ease);
        iconMenu.classList.remove('_active');
        menuBody.classList.remove('_active');
        document.body.classList.remove('_lock');

        if (progress < 1) {
            requestAnimationFrame(animateScroll);
        }
    }

    function easeOutCubic(t) {
        return 1 - Math.pow(1 - t, 3);
    }

    requestAnimationFrame(animateScroll);
}

document.addEventListener('click', function (event) {
    const target = event.target;
    if (target.matches('[data-scroll-to]')) {
        const targetId = target.getAttribute('data-scroll-to');
        const duration = 1000;
        scrollToElement(targetId, duration);
    }
});


// Проверка на @ в #telegram-input

// const courseForm = document.getElementById("course-form");

// courseForm.addEventListener("submit", function (e) {
//      e.preventDefault();
// })

// document.addEventListener("DOMContentLoaded", function () {
//     const courseForm = document.getElementById("course-form");
    // const telegramInput = document.getElementById("telegram-input");
    // const telegramErrorText = document.getElementById("telegram-error-text");

    // function validateTelegram() {
    //     const value = telegramInput.value;

    //     if (value.includes("@")) {
    //         telegramInput.classList.remove("error");
    //         telegramErrorText.textContent = "";
    //     } else {
    //         telegramInput.classList.add("error");
    //         telegramErrorText.textContent = "Введите корректный ник";
    //     }
    // }

    // telegramInput.addEventListener("input", validateTelegram);

    // courseForm.addEventListener("submit", function (e) {
    //     e.preventDefault();

    //     if (!telegramInput.value.includes("@")) {
    //         validateTelegram();
    //     } else {
    //         const formData = new FormData(courseForm);
    //         const name = formData.get("name");
    //         const username = formData.get("username");

    //         fetch("https://seahorse-app-5w7ll.ondigitalocean.app/send", {
    //             method: "POST",
    //             headers: {
    //                 "Content-Type": "application/json"
    //             },
    //             body: JSON.stringify({ name, username })
    //         })
    //         .then(response => response.json())
    //         .then(data => {
    //             console.log(data);
    //             courseForm.reset();
    //         })
    //         .catch(error => {
    //             console.error(error);
    //         });
    //     }
    // });
// });
