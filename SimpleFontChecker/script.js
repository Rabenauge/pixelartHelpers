/**
 * done by titus^rabenauge
 */

//set up some simple classes to help with some readable code

class CalcTile {
    columns = 0;
    rows = 0;

    calcRowAndColumns(
        width,
        height,
        gridX,
        gridY,
        rahmenLeft = 0,
        rahmenRight = 0,
        rahmenTop = 0,
        rahmenBottom = 0,
        gapLeft = 0,
        gapRight = 0,
        gapTop = 0,
        gapBottom = 0
    ) {
        const usableWidth = Math.max(0, width - rahmenLeft - rahmenRight);
        const usableHeight = Math.max(0, height - rahmenTop - rahmenBottom);
        const gapX = gapLeft + gapRight;
        const gapY = gapTop + gapBottom;
        const stepX = gridX + gapX;
        const stepY = gridY + gapY;
        const spanX = Math.max(0, usableWidth - gapLeft - gapRight + gapX);
        const spanY = Math.max(0, usableHeight - gapTop - gapBottom + gapY);
        this.columns = stepX > 0 ? Math.floor(spanX / stepX) : 0;
        this.rows = stepY > 0 ? Math.floor(spanY / stepY) : 0;
    }
    generateRandom(min = 0, max = 100) {
        let difference = max - min;
        let rand = Math.random();
        rand = Math.floor(rand * difference);
        rand = rand + min;
        return rand;
    }
}

class Font {
    tile = new CalcTile();
    charArray = [];
    ignoreChars = [];

    constructor(
        imgWidth,
        imgHeight,
        gridX,
        gridY,
        rahmenLeft = 0,
        rahmenRight = 0,
        rahmenTop = 0,
        rahmenBottom = 0,
        gapLeft = 0,
        gapRight = 0,
        gapTop = 0,
        gapBottom = 0,
        ignorechars = []
    ) {
        this.imgWidth = imgWidth;
        this.imgHeight = imgHeight;
        this.gridX = gridX;
        this.gridY = gridY;
        this.rahmenLeft = rahmenLeft;
        this.rahmenRight = rahmenRight;
        this.rahmenTop = rahmenTop;
        this.rahmenBottom = rahmenBottom;
        this.gapLeft = gapLeft;
        this.gapRight = gapRight;
        this.gapTop = gapTop;
        this.gapBottom = gapBottom;
        this.ignoreChars = ignorechars;
        this.tile.calcRowAndColumns(
            this.imgWidth,
            this.imgHeight,
            this.gridX,
            this.gridY,
            this.rahmenLeft,
            this.rahmenRight,
            this.rahmenTop,
            this.rahmenBottom,
            this.gapLeft,
            this.gapRight,
            this.gapTop,
            this.gapBottom
        );
        this.createCharArray();
    }
    createCharArray() {
        let i = 0;
        for (let x = 0; x < this.tile.rows; x++) {
            for (let y = 0; y < this.tile.columns; y++) {

                if (!this.ignoreChars.includes(i)) {
                    this.charArray.push([x, y]);
                }
                i++;
            }
        }
    }
    randomCharCoords() {
        const number = this.tile.generateRandom(0, this.charArray.length);
        const rowIndex = this.charArray[number][0];
        const colIndex = this.charArray[number][1];
        const gapX = this.gapLeft + this.gapRight;
        const gapY = this.gapTop + this.gapBottom;
        const srcX = this.rahmenLeft + this.gapLeft + colIndex * (this.gridX + gapX);
        const srcY = this.rahmenTop + this.gapTop + rowIndex * (this.gridY + gapY);
        return [srcY, srcX];
    }
}

// start here for the vars

const myImage = new Image();
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const fileInput = document.getElementById('fileInput');
const sourcePreview = document.getElementById('source');
const displayArea = document.getElementById('displayArea');
const canvasWInput = document.getElementById('canvasW');
const canvasHInput = document.getElementById('canvasH');
const gridWInput = document.getElementById('gridW');
const gridHInput = document.getElementById('gridH');
const tileLimitInput = document.getElementById('tileLimit');
const rahmenLeftInput = document.getElementById('rahmenLeft');
const rahmenRightInput = document.getElementById('rahmenRight');
const rahmenTopInput = document.getElementById('rahmenTop');
const rahmenBottomInput = document.getElementById('rahmenBottom');
const gapLeftInput = document.getElementById('gapLeft');
const gapRightInput = document.getElementById('gapRight');
const gapTopInput = document.getElementById('gapTop');
const gapBottomInput = document.getElementById('gapBottom');
const ignoreCharsInput = document.getElementById('ignoreChars');
const viewTabs = document.querySelectorAll('[data-view-tab]');
const saveSettingsButton = document.getElementById('saveSettings');
const loadSettingsButton = document.getElementById('loadSettings');
const loadSettingsInput = document.getElementById('loadSettingsInput');
const tickerToggleButton = document.getElementById('tickerToggle');
const zoomOutButton = document.getElementById('zoomOut');
const zoomResetButton = document.getElementById('zoomReset');
const zoomInButton = document.getElementById('zoomIn');
const previewModeSelect = document.getElementById('previewMode');
const previewSwitcher = document.getElementById('previewSwitcher');
const previewWrapper = document.querySelector('.preview');
const selectionBox = document.getElementById('selectionBox');
const listView = document.getElementById('listView');
const helpView = document.getElementById('helpView');
const previewTicker = document.getElementById('previewTicker');
const tickerLines = previewTicker ? Array.from(previewTicker.querySelectorAll('.ticker-line')) : [];
const tickerTracks = previewTicker ? Array.from(previewTicker.querySelectorAll('.ticker-track')) : [];
const tickerCanvases = previewTicker ? Array.from(previewTicker.querySelectorAll('.ticker-canvas')) : [];
const tickerContexts = tickerCanvases.map((canvas) => canvas.getContext('2d'));
let myFont = null;
let objectUrl = null;
let currentImageName = "font.png";
let renderScheduled = false;
let renderShouldUpdateTicker = false;

const numberFields = [
    { key: 'canvasW', input: canvasWInput, allowBlankZero: false },
    { key: 'canvasH', input: canvasHInput, allowBlankZero: false },
    { key: 'gridW', input: gridWInput, allowBlankZero: false },
    { key: 'gridH', input: gridHInput, allowBlankZero: false },
    { key: 'tileLimit', input: tileLimitInput, allowBlankZero: true },
    { key: 'rahmenLeft', input: rahmenLeftInput, allowBlankZero: true },
    { key: 'rahmenRight', input: rahmenRightInput, allowBlankZero: true },
    { key: 'rahmenTop', input: rahmenTopInput, allowBlankZero: true },
    { key: 'rahmenBottom', input: rahmenBottomInput, allowBlankZero: true },
    { key: 'gapLeft', input: gapLeftInput, allowBlankZero: true },
    { key: 'gapRight', input: gapRightInput, allowBlankZero: true },
    { key: 'gapTop', input: gapTopInput, allowBlankZero: true },
    { key: 'gapBottom', input: gapBottomInput, allowBlankZero: true }
];

function getViewMode() {
    const activeTab = Array.from(viewTabs).find((tab) => tab.classList.contains('active'));
    return activeTab ? activeTab.dataset.view || 'list' : 'list';
}

function getPreviewMode() {
    return previewModeSelect ? previewModeSelect.value : 'font-block';
}

function isScrollerPreviewSelected() {
    return getPreviewMode() === 'scrollers';
}

function shouldRenderTicker() {
    if (!previewTicker) {
        return false;
    }
    return getViewMode() === 'preview' && isScrollerPreviewSelected() && previewTicker.offsetParent !== null;
}

function isListViewSelected() {
    return getViewMode() === 'list';
}

function setActiveView(mode) {
    viewTabs.forEach(function (tab) {
        tab.classList.toggle('active', tab.dataset.view === mode);
    });
}
function setViewVisibility(mode) {
    const previewMode = getPreviewMode();
    const showPreviewControls = mode === 'preview';
    if (previewSwitcher) {
        previewSwitcher.style.display = showPreviewControls ? 'flex' : 'none';
    }
    if (listView) {
        listView.classList.toggle('active', mode === 'list');
    }
    if (canvas) {
        canvas.style.display = mode === 'preview' && previewMode === 'font-block' ? '' : 'none';
    }
    if (previewTicker) {
        previewTicker.style.display = mode === 'preview' && previewMode === 'scrollers' ? 'flex' : 'none';
    }
    if (previewWrapper) {
        previewWrapper.style.display = mode === 'help' ? 'none' : '';
    }
    if (helpView) {
        helpView.style.display = mode === 'help' ? 'block' : 'none';
    }
}

//vars you might want to change

const config = {
    canvasW: 512, //size x preview
    canvasH: 512, //size y preview
    gridW: 16, //x font width
    gridH: 16, //y font heigth
    tileLimit: 0, //0 = no limit
    rahmenLeft: 0,
    rahmenRight: 0,
    rahmenTop: 0,
    rahmenBottom: 0,
    gapLeft: 0,
    gapRight: 0,
    gapTop: 0,
    gapBottom: 0,
    tickerRunning: false,
    zoom: 1,
    ignoreChars: [] //just the plain tile number of the chars 
    //to ignore, keep that array empty if you don´t want to skip any
};

const TICKER_PIXELS_PER_SECOND = 12;

function loadFontImage(srcUrl) {
    myImage.src = srcUrl;
    if (sourcePreview) {
        sourcePreview.src = srcUrl;
    }
}

function updatePreviewLayout() {
    if (!displayArea) {
        return;
    }
    const showListView = isListViewSelected();
    const isPortrait = myImage.height > myImage.width;
    if (showListView) {
        displayArea.classList.toggle('preview-right', true);
        displayArea.classList.toggle('preview-below', false);
        return;
    }
    displayArea.classList.toggle('preview-right', isPortrait);
    displayArea.classList.toggle('preview-below', !isPortrait);
}

function updateTickerSpeed() {
    if (tickerTracks.length === 0) {
        return;
    }
    if (!shouldRenderTicker()) {
        return;
    }
    tickerTracks.forEach(function (track) {
        const line = track.closest('.ticker-line');
        const width = line ? line.getBoundingClientRect().width : track.getBoundingClientRect().width;
        if (width <= 0) {
            return;
        }
        const speedMultiplier = parseFloat(track.dataset.speed || '1');
        const duration = width / (TICKER_PIXELS_PER_SECOND * speedMultiplier);
        track.style.animationDuration = `${duration}s`;
        track.classList.remove('ticker-animate');
        track.offsetHeight;
        track.classList.add('ticker-animate');
    });
}

function restartTickerAnimation() {
    if (tickerTracks.length === 0) {
        return;
    }
    if (!shouldRenderTicker()) {
        return;
    }
    tickerTracks.forEach(function (track) {
        track.classList.remove('ticker-animate');
        track.offsetHeight;
        track.classList.add('ticker-animate');
    });
}

function setTickerRunning(isRunning) {
    if (tickerTracks.length === 0 || !tickerToggleButton) {
        return;
    }
    if (isRunning) {
        if (shouldRenderTicker()) {
            renderTicker();
            updateTickerSpeed();
            restartTickerAnimation();
        }
    }
    tickerTracks.forEach(function (track) {
        track.style.animationPlayState = isRunning ? 'running' : 'paused';
    });
    tickerToggleButton.textContent = isRunning ? 'Stop Scroller' : 'Start Scroller';
}

function updateTickerHeight() {
    const tickerHeight = config.gridH * config.zoom + 2;
    document.documentElement.style.setProperty('--ticker-height', `${tickerHeight}px`);
}

function scheduleRender(shouldUpdateTicker) {
    renderShouldUpdateTicker = renderShouldUpdateTicker || shouldUpdateTicker;
    if (renderScheduled) {
        return;
    }
    renderScheduled = true;
    requestAnimationFrame(function () {
        renderScheduled = false;
        renderFontPreview(renderShouldUpdateTicker);
        applyZoom();
        updateSelectionBoxFromOrigin();
        renderShouldUpdateTicker = false;
    });
}

function applyZoom() {
    if (displayArea) {
        displayArea.classList.toggle('zoomed', config.zoom > 1);
    }
    if (isListViewSelected()) {
        if (listView) {
            listView.style.transform = `scale(${config.zoom})`;
            listView.style.transformOrigin = 'top left';
        }
        if (previewWrapper) {
            const listWidth = listView ? listView.scrollWidth : canvas.width;
            const offset = Math.max(0, listWidth * (config.zoom - 1));
            previewWrapper.style.marginLeft = `${offset}px`;
        }
    } else {
        if (listView) {
            listView.style.transform = '';
        }
        if (previewWrapper) {
            previewWrapper.style.marginLeft = '';
        }
    }
    if (canvas) {
        canvas.style.transform = `scale(${config.zoom})`;
        canvas.style.transformOrigin = 'top left';
        canvas.style.imageRendering = 'pixelated';
    }
    if (tickerCanvases.length > 0) {
        tickerCanvases.forEach(function (canvas) {
            canvas.style.transform = `scale(${config.zoom})`;
            canvas.style.transformOrigin = 'left center';
            canvas.style.imageRendering = 'pixelated';
        });
    }
    updateTickerHeight();
    if (config.tickerRunning) {
        updateTickerSpeed();
    }
}

function updateZoom(delta) {
    config.zoom = Math.min(4, Math.max(1, config.zoom + delta));
    applyZoom();
}


function renderListView() {
    if (!listView) {
        return;
    }
    setViewVisibility('list');
    listView.classList.add('active');
    listView.innerHTML = '';
    const fragment = document.createDocumentFragment();
    for (let i = 0; i < myFont.charArray.length; i++) {
        const rowIndex = myFont.charArray[i][0];
        const colIndex = myFont.charArray[i][1];
        const charIndex = rowIndex * myFont.tile.columns + colIndex;
        const row = document.createElement('div');
        row.className = 'list-row';
        const label = document.createElement('span');
        label.textContent = String(charIndex);
        const labelCol = document.createElement('div');
        labelCol.className = 'list-col';
        labelCol.appendChild(label);
        const tileCanvas = document.createElement('canvas');
        tileCanvas.width = config.gridW;
        tileCanvas.height = config.gridH;
        const tileCtx = tileCanvas.getContext('2d');
        tileCtx.imageSmoothingEnabled = false;
        const gapX = config.gapLeft + config.gapRight;
        const gapY = config.gapTop + config.gapBottom;
        const srcX = config.rahmenLeft + config.gapLeft + colIndex * (config.gridW + gapX);
        const srcY = config.rahmenTop + config.gapTop + rowIndex * (config.gridH + gapY);
        tileCtx.drawImage(myImage, srcX, srcY, config.gridW, config.gridH, 0, 0, config.gridW, config.gridH);
        const tileCol = document.createElement('div');
        tileCol.className = 'list-col';
        tileCol.appendChild(tileCanvas);
        const toggleInput = document.createElement('input');
        toggleInput.type = 'checkbox';
        toggleInput.addEventListener('change', function () {
            const next = new Set(config.ignoreChars);
            if (toggleInput.checked) {
                next.add(charIndex);
            } else {
                next.delete(charIndex);
            }
            const nextList = Array.from(next).sort((a, b) => a - b);
            config.ignoreChars = nextList;
            if (ignoreCharsInput) {
                ignoreCharsInput.value = nextList.join(',');
            }
            scheduleRender(true);
        });
        const toggleCol = document.createElement('div');
        toggleCol.className = 'list-col';
        toggleCol.appendChild(toggleInput);
        row.appendChild(labelCol);
        row.appendChild(tileCol);
        row.appendChild(toggleCol);
        fragment.appendChild(row);
    }
    listView.appendChild(fragment);
}

let isSelecting = false;
let selectionStart = null;
let isDraggingOverlay = false;
let dragOffset = null;
let overlayOrigin = { x: 0, y: 0 };
const OVERLAY_NUDGE_Y = -1;

function getImagePoint(event) {
    if (!sourcePreview) {
        return null;
    }
    const rect = sourcePreview.getBoundingClientRect();
    if (rect.width <= 0 || rect.height <= 0) {
        return null;
    }
    const x = Math.min(Math.max(event.clientX - rect.left, 0), rect.width);
    const y = Math.min(Math.max(event.clientY - rect.top, 0), rect.height);
    return { x, y, rect };
}

function updateSelectionBox(start, end) {
    if (!selectionBox || !previewWrapper || !sourcePreview) {
        return;
    }
    const wrapperRect = previewWrapper.getBoundingClientRect();
    const imgRect = sourcePreview.getBoundingClientRect();
    const offsetX = imgRect.left - wrapperRect.left;
    const offsetY = imgRect.top - wrapperRect.top;
    const left = Math.min(start.x, end.x);
    const top = Math.min(start.y, end.y);
    const width = Math.abs(end.x - start.x);
    const height = Math.abs(end.y - start.y);
    selectionBox.style.left = `${offsetX + left}px`;
    selectionBox.style.top = `${offsetY + top + OVERLAY_NUDGE_Y}px`;
    selectionBox.style.width = `${width}px`;
    selectionBox.style.height = `${height}px`;
}

function updateSelectionBoxFromOrigin() {
    if (!selectionBox || !previewWrapper || !sourcePreview) {
        return;
    }
    const wrapperRect = previewWrapper.getBoundingClientRect();
    const imgRect = sourcePreview.getBoundingClientRect();
    const offsetX = imgRect.left - wrapperRect.left;
    const offsetY = imgRect.top - wrapperRect.top;
    const scaleX = imgRect.width > 0 ? imgRect.width / sourcePreview.naturalWidth : 1;
    const scaleY = imgRect.height > 0 ? imgRect.height / sourcePreview.naturalHeight : 1;
    const gapX = config.gapLeft + config.gapRight;
    const gapY = config.gapTop + config.gapBottom;
    const left = overlayOrigin.x - config.gapLeft;
    const top = overlayOrigin.y - config.gapTop;
    selectionBox.style.left = `${offsetX + left * scaleX}px`;
    selectionBox.style.top = `${offsetY + top * scaleY + OVERLAY_NUDGE_Y}px`;
    selectionBox.style.width = `${(config.gridW + gapX) * scaleX}px`;
    selectionBox.style.height = `${(config.gridH + gapY) * scaleY}px`;
    selectionBox.style.display = 'block';
}

function moveOverlayByPixels(dx, dy) {
    if (!sourcePreview) {
        return;
    }
    const maxX = Math.max(0, sourcePreview.naturalWidth - config.gridW - config.gapRight);
    const maxY = Math.max(0, sourcePreview.naturalHeight - config.gridH - config.gapBottom);
    const minX = Math.max(0, config.gapLeft);
    const minY = Math.max(0, config.gapTop);
    const nextX = Math.min(Math.max(overlayOrigin.x + dx, minX), maxX);
    const nextY = Math.min(Math.max(overlayOrigin.y + dy, minY), maxY);
    overlayOrigin = { x: nextX, y: nextY };
    updateSelectionBoxFromOrigin();
}

function setOverlayOriginFromEvent(event) {
    const point = getImagePoint(event);
    if (!point) {
        return;
    }
    const scaleX = sourcePreview.naturalWidth / point.rect.width;
    const scaleY = sourcePreview.naturalHeight / point.rect.height;
    const maxX = Math.max(0, sourcePreview.naturalWidth - config.gridW - config.gapRight);
    const maxY = Math.max(0, sourcePreview.naturalHeight - config.gridH - config.gapBottom);
    const minX = Math.max(0, config.gapLeft);
    const minY = Math.max(0, config.gapTop);
    const targetX = Math.min(Math.max(point.x * scaleX - config.gridW / 2, minX), maxX);
    const targetY = Math.min(Math.max(point.y * scaleY - config.gridH / 2, minY), maxY);
    overlayOrigin = { x: targetX, y: targetY };
    updateSelectionBoxFromOrigin();
}

function beginSelection(event) {
    if (!isListViewSelected()) {
        return;
    }
    const point = getImagePoint(event);
    if (!point || !selectionBox) {
        return;
    }
    isSelecting = true;
    selectionStart = point;
    selectionBox.style.display = 'block';
    updateSelectionBox(point, point);
}

function moveSelection(event) {
    if (!isSelecting || !selectionStart) {
        return;
    }
    const point = getImagePoint(event);
    if (!point) {
        return;
    }
    updateSelectionBox(selectionStart, point);
}

function endSelection(event) {
    if (!isSelecting || !selectionStart) {
        return;
    }
    const point = getImagePoint(event);
    isSelecting = false;
    if (selectionBox) {
        selectionBox.style.display = 'none';
    }
    if (!point) {
        return;
    }
    const width = Math.abs(point.x - selectionStart.x);
    const height = Math.abs(point.y - selectionStart.y);
    if (width < 1 || height < 1) {
        setOverlayOriginFromEvent(event);
        return;
    }
    const scaleX = sourcePreview.naturalWidth / point.rect.width;
    const scaleY = sourcePreview.naturalHeight / point.rect.height;
    const nextGridW = Math.max(1, Math.round(width * scaleX));
    const nextGridH = Math.max(1, Math.round(height * scaleY));
    if (gridWInput) gridWInput.value = String(nextGridW);
    if (gridHInput) gridHInput.value = String(nextGridH);
    updateConfigFromInputs();
    if (selectionBox) {
        selectionBox.style.display = 'block';
    }
}

function renderRandomView() {
    if (listView) {
        listView.classList.remove('active');
    }
    setViewVisibility('preview');
    canvas.style.display = '';
    canvas.width = config.canvasW;
    canvas.height = config.canvasH;
    if (!myFont || myFont.charArray.length === 0 || config.gridW <= 0 || config.gridH <= 0) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        return;
    }
    const targetCalc = new CalcTile();
    targetCalc.calcRowAndColumns(canvas.width, canvas.height, config.gridW, config.gridH);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let r = 0; r < targetCalc.rows; r++) {
        for (let c = 0; c < targetCalc.columns; c++) {
            const rndTilePos = myFont.randomCharCoords();
            ctx.drawImage(myImage, rndTilePos[1], rndTilePos[0], config.gridW, config.gridH, c * config.gridW, r * config.gridH, config.gridW, config.gridH);
        }
    }
}

function renderFontPreview(shouldUpdateTicker = true) {
    const viewMode = getViewMode();
    const previewMode = getPreviewMode();
    if (viewMode === 'help') {
        renderHelpView();
        return;
    }
    if (!myImage.complete || myImage.naturalWidth === 0) {
        return;
    }
    updatePreviewLayout();
    const showListView = viewMode === 'list';
    const showScrollerPreview = viewMode === 'preview' && previewMode === 'scrollers';
    myFont = new Font(
        myImage.width,
        myImage.height,
        config.gridW,
        config.gridH,
        config.rahmenLeft,
        config.rahmenRight,
        config.rahmenTop,
        config.rahmenBottom,
        config.gapLeft,
        config.gapRight,
        config.gapTop,
        config.gapBottom,
        config.ignoreChars
    );
    if (config.tileLimit > 0) {
        myFont.charArray = myFont.charArray.slice(0, config.tileLimit);
    }
    if (showListView) {
        renderListView();
        return;
    }
    if (showScrollerPreview) {
        setViewVisibility('preview');
        if (shouldUpdateTicker) {
            renderTicker();
        }
        return;
    }
    renderRandomView();
    if (shouldUpdateTicker && showScrollerPreview) {
        renderTicker();
    }
}

myImage.addEventListener('load', function () {
    scheduleRender(true);
});

fileInput.addEventListener('change', function () {
    const file = fileInput.files && fileInput.files[0];
    if (!file) {
        return;
    }
    if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
        objectUrl = null;
    }
    objectUrl = URL.createObjectURL(file);
    currentImageName = file.name || "font.png";
    loadFontImage(objectUrl);
    const storageKey = getStorageKey(currentImageName);
    const stored = localStorage.getItem(storageKey);
    if (stored) {
        const shouldLoadStorage = window.confirm(`LocalStorage-Eintrag für "${currentImageName}" laden?`);
        if (shouldLoadStorage) {
            try {
                applySettings(JSON.parse(stored));
                return;
            } catch (error) {
                // ignore invalid storage
            }
        }
    }
    if (loadSettingsInput) {
        const baseName = getBaseName(currentImageName);
        const expectedName = `${baseName}-tile.set`;
        const shouldLoad = window.confirm(`Settings-Datei "${expectedName}" laden?`);
        if (shouldLoad) {
            loadSettingsInput.value = '';
            loadSettingsInput.click();
        }
    }
});

function parseNumber(value, fallback) {
    const parsed = Number.parseInt(value, 10);
    return Number.isFinite(parsed) ? parsed : fallback;
}

function parseIgnoreChars(value) {
    return value
        .split(',')
        .map((chunk) => Number.parseInt(chunk.trim(), 10))
        .filter((num) => Number.isFinite(num));
}

function syncInputsToConfig() {
    numberFields.forEach(function (field) {
        if (field.input) {
            field.input.value = String(config[field.key]);
        }
    });
    if (ignoreCharsInput) ignoreCharsInput.value = config.ignoreChars.join(',');
    setActiveView('list');
}

function updateConfigFromInputs() {
    numberFields.forEach(function (field) {
        if (!field.input) {
            return;
        }
        const rawValue = field.input.value.trim();
        if (field.allowBlankZero && rawValue === '') {
            config[field.key] = 0;
            return;
        }
        config[field.key] = parseNumber(rawValue, config[field.key]);
    });
    if (ignoreCharsInput) config.ignoreChars = parseIgnoreChars(ignoreCharsInput.value);
    scheduleRender(true);
}

numberFields.forEach(function (field) {
    if (field.input) {
        field.input.addEventListener('input', updateConfigFromInputs);
    }
});
if (ignoreCharsInput) ignoreCharsInput.addEventListener('input', updateConfigFromInputs);
viewTabs.forEach(function (tab) {
    tab.addEventListener('click', function () {
        setActiveView(tab.dataset.view || 'list');
        scheduleRender(false);
        if (selectionBox) {
            selectionBox.style.display = 'none';
        }
        isSelecting = false;
        isDraggingOverlay = false;
    });
});
if (previewModeSelect) {
    previewModeSelect.addEventListener('change', function () {
        if (isScrollerPreviewSelected()) {
            config.tickerRunning = true;
            setTickerRunning(true);
        } else {
            config.tickerRunning = false;
            setTickerRunning(false);
        }
        scheduleRender(true);
    });
}
if (tickerToggleButton) {
    tickerToggleButton.addEventListener('click', function () {
        config.tickerRunning = !config.tickerRunning;
        setTickerRunning(config.tickerRunning);
    });
}
if (zoomOutButton) zoomOutButton.addEventListener('click', function () { updateZoom(-0.1); });
if (zoomResetButton) zoomResetButton.addEventListener('click', function () { config.zoom = 1; applyZoom(); });
if (zoomInButton) zoomInButton.addEventListener('click', function () { updateZoom(0.1); });
if (saveSettingsButton) {
    saveSettingsButton.addEventListener('click', function () {
        const baseName = getBaseName(currentImageName);
        const filename = `${baseName}-tile.set`;
        const payload = JSON.stringify(collectSettings(), null, 2);
        const storageKey = getStorageKey(currentImageName);
        try {
            localStorage.setItem(storageKey, payload);
        } catch (error) {
            // ignore storage errors
        }
        const blob = new Blob([payload], { type: 'application/json' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(link.href);
    });
}
if (loadSettingsButton && loadSettingsInput) {
    loadSettingsButton.addEventListener('click', function () {
        loadSettingsInput.value = '';
        loadSettingsInput.click();
    });
    loadSettingsInput.addEventListener('change', function () {
        const file = loadSettingsInput.files && loadSettingsInput.files[0];
        if (!file) {
            return;
        }
        const reader = new FileReader();
        reader.onload = function () {
            try {
                const data = JSON.parse(String(reader.result));
                applySettings(data);
            } catch (error) {
                // ignore invalid files
            }
        };
        reader.readAsText(file);
    });
}
if (sourcePreview) {
    sourcePreview.addEventListener('mousedown', beginSelection);
}
if (selectionBox) {
    selectionBox.addEventListener('mousedown', function (event) {
        event.preventDefault();
        isDraggingOverlay = true;
        const point = getImagePoint(event);
        if (!point) {
            return;
        }
        const scaleX = sourcePreview.naturalWidth / point.rect.width;
        const scaleY = sourcePreview.naturalHeight / point.rect.height;
        dragOffset = {
            x: point.x * scaleX - overlayOrigin.x,
            y: point.y * scaleY - overlayOrigin.y
        };
    });
}
document.addEventListener('mousemove', moveSelection);
document.addEventListener('mouseup', endSelection);
document.addEventListener('keydown', function (event) {
    if (event.target && (event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA' || event.target.tagName === 'SELECT' || event.target.isContentEditable)) {
        return;
    }
    if (!isListViewSelected()) {
        return;
    }
    const stepX = event.ctrlKey ? config.gridW : (event.shiftKey ? 10 : 1);
    const stepY = event.ctrlKey ? config.gridH : (event.shiftKey ? 10 : 1);
    if (event.key === 'ArrowLeft') {
        event.preventDefault();
        moveOverlayByPixels(-stepX, 0);
    } else if (event.key === 'ArrowRight') {
        event.preventDefault();
        moveOverlayByPixels(stepX, 0);
    } else if (event.key === 'ArrowUp') {
        event.preventDefault();
        moveOverlayByPixels(0, -stepY);
    } else if (event.key === 'ArrowDown') {
        event.preventDefault();
        moveOverlayByPixels(0, stepY);
    }
});

function enforceNumberMaxLength(input) {
    if (!input) {
        return;
    }
    const raw = input.value;
    if (raw.length <= 4) {
        return;
    }
    input.value = raw.slice(0, 4);
}

document.querySelectorAll('input[type="number"]').forEach(function (input) {
    input.addEventListener('input', function () {
        enforceNumberMaxLength(input);
    });
});

function getBaseName(filename) {
    const dotIndex = filename.lastIndexOf('.');
    return dotIndex > 0 ? filename.slice(0, dotIndex) : filename;
}

function getStorageKey(filename) {
    const baseName = getBaseName(filename || "font.png");
    return `tile-settings:${baseName}`;
}

function collectSettings() {
    const settings = { ignoreChars: config.ignoreChars.slice() };
    numberFields.forEach(function (field) {
        settings[field.key] = config[field.key];
    });
    return settings;
}

function applySettings(settings) {
    if (!settings || typeof settings !== 'object') {
        return;
    }
    numberFields.forEach(function (field) {
        if (!field.input) {
            return;
        }
        const value = settings[field.key];
        field.input.value = String(value ?? config[field.key]);
    });
    if (ignoreCharsInput) ignoreCharsInput.value = Array.isArray(settings.ignoreChars) ? settings.ignoreChars.join(',') : config.ignoreChars.join(',');
    updateConfigFromInputs();
}

function renderHelpView() {
    setViewVisibility('help');
}
document.addEventListener('mousemove', function (event) {
    if (!isDraggingOverlay || !dragOffset) {
        return;
    }
    const point = getImagePoint(event);
    if (!point) {
        return;
    }
    const scaleX = sourcePreview.naturalWidth / point.rect.width;
    const scaleY = sourcePreview.naturalHeight / point.rect.height;
    const maxX = Math.max(0, sourcePreview.naturalWidth - config.gridW);
    const maxY = Math.max(0, sourcePreview.naturalHeight - config.gridH);
    const targetX = Math.min(Math.max(point.x * scaleX - dragOffset.x, 0), maxX);
    const targetY = Math.min(Math.max(point.y * scaleY - dragOffset.y, 0), maxY);
    overlayOrigin = { x: targetX, y: targetY };
    updateSelectionBoxFromOrigin();
});
document.addEventListener('mouseup', function () {
    isDraggingOverlay = false;
    dragOffset = null;
});

syncInputsToConfig();
scheduleRender(true);
setTickerRunning(config.tickerRunning);
loadFontImage("font.png");

function renderTicker() {
    if (tickerCanvases.length === 0 || !myImage.complete || myImage.naturalWidth === 0 || !myFont) {
        return;
    }
    if (!shouldRenderTicker()) {
        return;
    }
    const tileWidth = config.gridW;
    const tileHeight = config.gridH;
    if (tileWidth <= 0 || tileHeight <= 0 || myFont.charArray.length === 0) {
        tickerContexts.forEach(function (ctx, index) {
            const canvas = tickerCanvases[index];
            if (!ctx || !canvas) {
                return;
            }
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        });
        return;
    }
    tickerContexts.forEach(function (ctx, index) {
        const canvas = tickerCanvases[index];
        const line = tickerLines[index];
        if (!ctx || !canvas || !line) {
            return;
        }
        const lineWidth = line.getBoundingClientRect().width;
        if (lineWidth <= 0) {
            return;
        }
        const minTiles = Math.max(1, Math.ceil(lineWidth / tileWidth));
        const extraTiles = Math.floor(Math.random() * (minTiles + 1));
        const tileCount = minTiles + extraTiles;
        canvas.width = tileCount * tileWidth;
        canvas.height = tileHeight;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const tiles = myFont.charArray;
        for (let i = 0; i < tileCount; i++) {
            const tileIndex = tiles[Math.floor(Math.random() * tiles.length)];
            const gapX = config.gapLeft + config.gapRight;
            const gapY = config.gapTop + config.gapBottom;
            const srcX = config.rahmenLeft + config.gapLeft + tileIndex[1] * (tileWidth + gapX);
            const srcY = config.rahmenTop + config.gapTop + tileIndex[0] * (tileHeight + gapY);
            ctx.drawImage(myImage, srcX, srcY, tileWidth, tileHeight, i * tileWidth, 0, tileWidth, tileHeight);
        }
    });
    updateTickerHeight();
    updateTickerSpeed();
}

tickerTracks.forEach(function (track) {
    track.addEventListener('animationiteration', renderTicker);
});
