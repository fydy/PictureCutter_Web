// 得到各个元素
var app = document.getElementById("app");

// 各种纸尺寸大小的比例
const A4 = 210 / 297;
const A3 = 297 / 420;

// 图片的方向
const HORIZONTAL = Symbol();
const VERTICAL = Symbol();

// 上传的图片元素
var upload_img = new Image();

// 初始化图片
function InitImage (source) {
    var file = source.files[0];
    if (window.FileReader) {
        var fileReader = new FileReader();
        fileReader.onloadend = function (e) {
            upload_img.src = e.target.result;
        };
        fileReader.readAsDataURL(file);
    }
}

// 动态创建 canvas 并对图像裁剪和显示
function cutPicture () {
    var pageType = getInputPageType();
    var pageNum = getPageAmount(pageType);
    var cutterLength = getCutterLength(pageType);
    var direaction = getPictureDireaction();
    for (let i = 0; i < pageNum; i++) {
        var new_canvas = document.createElement("canvas");
        new_canvas.id = "cutter_canvas" + i;
        if (direaction === VERTICAL) {
            new_canvas.width = upload_img.width;
            new_canvas.height = cutterLength;
            var ctx = new_canvas.getContext("2d");
            ctx.drawImage(upload_img, 0, cutterLength * i, upload_img.width, cutterLength, 0, 0, new_canvas.width, new_canvas.height);
        } else {
            new_canvas.width = cutterLength;
            new_canvas.height = upload_img.height;
            var ctx = new_canvas.getContext("2d");
            ctx.drawImage(upload_img, cutterLength * i, 0, cutterLength, upload_img.height, 0, 0, new_canvas.width, new_canvas.height);
        }
        downloadPicture(new_canvas);
    }
}

// 批量下载图片
function downloadPicture (canvas) {
    var pictureType = getInputPictureType();
    var download_a = document.createElement("a");
    download_a.download = "下载";
    download_a.href = canvas.toDataURL("image/" + pictureType);
    download_a.click();
}

// 判断图片是横向还是纵向
function getPictureDireaction () {
    return upload_img.height >= upload_img.width ? VERTICAL : HORIZONTAL;
}

// 计算图片将会切割成几页
function getPageAmount (pageType) {
    var direaction = getPictureDireaction();
    if (direaction === VERTICAL) {
        return pageType * (upload_img.height / upload_img.width);
    } else {
        return pageType * (upload_img.width / upload_img.height);
    }
}

// 计算每次裁剪的长度值
function getCutterLength (pageType) {
    var direaction = getPictureDireaction();
    if (direaction === VERTICAL) {
        return (1 / pageType) * upload_img.width;
    } else {
        return (1 / pageType) * upload_img.height;
    }
}

// 得到用户选择的裁剪比例类型
function getInputPageType () {
    return getRadioValue("pageType");
}

// 得到用户选择的导出图片格式
function getInputPictureType () {
    return getRadioValue("pictureType");
}

// 根据 radioName 得到单选按钮的值
function getRadioValue (radioName) {
    var radios = document.getElementsByName(radioName);
    for (let i = 0; i < radios.length; i++) {
        if (radios[i].checked) {
            return radios[i].value;
        }
    }
}