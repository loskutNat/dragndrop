'use strict';
document.addEventListener("DOMContentLoaded", function () {
    var dragObject = {};
    document.onmousedown = function (e) {
        if (e.which !== 1) {
            return;
        }
        var elem = e.target.closest('.draggable');
        if (!elem) {
            return;
        }
        dragObject.elem = elem;
        dragObject.downX = e.pageX;
        dragObject.downY = e.pageY;
        console.log(dragObject.downX);
    }
    document.onmousemove = function (e) {
        if (!dragObject.elem) return;
        if (!dragObject.avatar) {
            var moveX = e.pageX - dragObject.downX;
            var moveY = e.pageY - dragObject.downY;
            console.log(moveY);
            if (Math.abs(moveX) < 3 && Math.abs(moveY) < 3) {
                return;
            }

            function createAvatar(e) {
                var avatar = dragObject.elem;
                console.log( avatar );
                var old = {
                    parent: avatar.parentNode
                    , nextSibling: avatar.nextSibling
                    , position: avatar.position || ''
                    , left: avatar.left || ''
                    , top: avatar.top || ''
                    , zIndex: avatar.zIndex || ''
                }
                avatar.rollback = function () {
                    old.parent.insertBefore(avatar, old.nextSibling);
                    avatar.style.position = old.position;
                    avatar.style.left = old.left;
                    avatar.style.top = old.top;
                    avatar.style.zIndex = old.zIndex
                };
                return avatar;
            };

            function getCoords(elem) {
                var box = elem.getBoundingClientRect();
                return {
                    top: box.top + pageYOffset
                    , left: box.left + pageXOffset
                };
            }
            dragObject.avatar = createAvatar(e);
            if (!dragObject.avatar) {
                dragObject = {};
                return;
            }

            function startDrag(e) {
                var avatar = dragObject.avatar;
                console.log(avatar);
                document.body.appendChild(avatar);
                avatar.style.zIndex = 9999;
                avatar.style.position = 'absolute';
            }
            var coords = getCoords(dragObject.avatar);
            dragObject.shiftX = dragObject.downX - coords.left;
            dragObject.shiftY = dragObject.downY - coords.top;
            startDrag(e);
        }
        dragObject.avatar.style.left = e.pageX - dragObject.shiftX + 'px';
        dragObject.avatar.style.top = e.pageY - dragObject.shiftY + 'px';
        console.log(dragObject.avatar.style.top);
        return false;
    }

    function findDroppable(event) {
        dragObject.avatar.hidden = true;
        var elem = document.elementFromPoint(event.clientX, event.clientY);
        dragObject.avatar.hidden = false;
        if (elem == null) {
            return null;
        }
        return elem.closest('.droppable');
    }

    function finishDrag(e) {
        var dropElem = findDroppable(e);
        if (dropElem) {
            return;
        }
        else {
            return false;
        }
    }
    document.onmouseup = function (e) {
        if (dragObject.avatar) {
            finishDrag(e);
        }
        dragObject = {};
    }
});