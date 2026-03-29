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
const inspectorViewport = document.getElementById('inspectorViewport');
const inspectorSurface = document.getElementById('inspectorSurface');
const gridOverlay = document.getElementById('gridOverlay');
const frameTopOverlay = document.getElementById('frameTopOverlay');
const frameRightOverlay = document.getElementById('frameRightOverlay');
const frameBottomOverlay = document.getElementById('frameBottomOverlay');
const frameLeftOverlay = document.getElementById('frameLeftOverlay');
const gapTopOverlay = document.getElementById('gapTopOverlay');
const gapRightOverlay = document.getElementById('gapRightOverlay');
const gapBottomOverlay = document.getElementById('gapBottomOverlay');
const gapLeftOverlay = document.getElementById('gapLeftOverlay');
const selectionBox = document.getElementById('selectionBox');
const dragBox = document.getElementById('dragBox');
const hoverTooltip = document.getElementById('hoverTooltip');
const inspectorStatus = document.getElementById('inspectorStatus');
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
const numberFieldMap = new Map(numberFields.map((field) => [field.key, field.input]));

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
    refreshInspector();
    updateTickerHeight();
    if (config.tickerRunning) {
        updateTickerSpeed();
    }
}

function updateZoom(delta) {
    config.zoom = Math.min(8, Math.max(1, Number((config.zoom + delta).toFixed(2))));
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

let selectionStart = null;
let activePointerMode = null;
let dragOffset = null;
let resizeState = null;
let overlayAdjustState = null;
let tooltipTimer = null;
const MIN_SELECTION_PIXELS = 2;
const tooltipDescriptions = {
    'frame-top': 'Frame top: outer padding above the first tile row. Drag vertically to change it.',
    'frame-right': 'Frame right: outer padding on the right image edge. Drag horizontally to change it.',
    'frame-bottom': 'Frame bottom: outer padding below the last tile row. Drag vertically to change it.',
    'frame-left': 'Frame left: outer padding before the first tile column. Drag horizontally to change it.',
    'gap-top': 'Gap top: vertical spacing before each tile area. Drag vertically to change it.',
    'gap-right': 'Gap right: horizontal spacing after each tile area. Drag horizontally to change it.',
    'gap-bottom': 'Gap bottom: vertical spacing after each tile area. Drag vertically to change it.',
    'gap-left': 'Gap left: horizontal spacing before each tile area. Drag horizontally to change it.'
};
const offsetOverlays = [
    { element: frameTopOverlay, kind: 'frame', side: 'top' },
    { element: frameRightOverlay, kind: 'frame', side: 'right' },
    { element: frameBottomOverlay, kind: 'frame', side: 'bottom' },
    { element: frameLeftOverlay, kind: 'frame', side: 'left' },
    { element: gapTopOverlay, kind: 'gap', side: 'top' },
    { element: gapRightOverlay, kind: 'gap', side: 'right' },
    { element: gapBottomOverlay, kind: 'gap', side: 'bottom' },
    { element: gapLeftOverlay, kind: 'gap', side: 'left' }
];

function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
}

function setFieldValue(key, value) {
    config[key] = value;
    const input = numberFieldMap.get(key);
    if (input) {
        input.value = String(value);
    }
}

function getTileOrigin() {
    return {
        x: config.rahmenLeft + config.gapLeft,
        y: config.rahmenTop + config.gapTop
    };
}

function getSelectionBounds() {
    const origin = getTileOrigin();
    return {
        left: origin.x,
        top: origin.y,
        width: config.gridW,
        height: config.gridH
    };
}

function getSelectionEdges() {
    const bounds = getSelectionBounds();
    return {
        left: bounds.left,
        top: bounds.top,
        right: bounds.left + bounds.width,
        bottom: bounds.top + bounds.height
    };
}

function getOverlayValue(kind, side) {
    const key = `${kind === 'frame' ? 'rahmen' : 'gap'}${side.charAt(0).toUpperCase()}${side.slice(1)}`;
    return config[key];
}

function setOverlayValue(kind, side, value) {
    const key = `${kind === 'frame' ? 'rahmen' : 'gap'}${side.charAt(0).toUpperCase()}${side.slice(1)}`;
    setFieldValue(key, value);
}

function getOverlayLimit(kind, side) {
    if (!sourcePreview) {
        return 0;
    }
    const widthLimit = Math.max(0, sourcePreview.naturalWidth - config.gridW);
    const heightLimit = Math.max(0, sourcePreview.naturalHeight - config.gridH);
    if (kind === 'frame') {
        if (side === 'left') {
            return Math.max(0, sourcePreview.naturalWidth - config.gapLeft - config.gridW);
        }
        if (side === 'right') {
            return Math.max(0, sourcePreview.naturalWidth - config.rahmenLeft - config.gapLeft - config.gridW);
        }
        if (side === 'top') {
            return Math.max(0, sourcePreview.naturalHeight - config.gapTop - config.gridH);
        }
        if (side === 'bottom') {
            return Math.max(0, sourcePreview.naturalHeight - config.rahmenTop - config.gapTop - config.gridH);
        }
    }
    if (side === 'left') {
        return widthLimit - config.rahmenLeft;
    }
    if (side === 'right') {
        return Math.max(0, sourcePreview.naturalWidth - config.rahmenLeft - config.gapLeft - config.gridW);
    }
    if (side === 'top') {
        return heightLimit - config.rahmenTop;
    }
    return Math.max(0, sourcePreview.naturalHeight - config.rahmenTop - config.gapTop - config.gridH);
}

function setOverlayRect(element, left, top, width, height, isVisible) {
    if (!element) {
        return;
    }
    if (!isVisible || width <= 0 || height <= 0) {
        element.classList.remove('is-active');
        element.style.display = 'none';
        return;
    }
    element.style.left = `${Math.round(left * config.zoom)}px`;
    element.style.top = `${Math.round(top * config.zoom)}px`;
    element.style.width = `${Math.max(1, Math.round(width * config.zoom))}px`;
    element.style.height = `${Math.max(1, Math.round(height * config.zoom))}px`;
    element.style.display = 'block';
    element.classList.add('is-active');
}

function updateOffsetOverlays() {
    if (!sourcePreview || !sourcePreview.naturalWidth || !sourcePreview.naturalHeight) {
        return;
    }
    const bounds = getSelectionBounds();
    setOverlayRect(frameLeftOverlay, 0, bounds.top, config.rahmenLeft, bounds.height, config.rahmenLeft > 0);
    setOverlayRect(frameRightOverlay, Math.max(0, sourcePreview.naturalWidth - config.rahmenRight), bounds.top, config.rahmenRight, bounds.height, config.rahmenRight > 0);
    setOverlayRect(frameTopOverlay, bounds.left, 0, bounds.width, config.rahmenTop, config.rahmenTop > 0);
    setOverlayRect(frameBottomOverlay, bounds.left, Math.max(0, sourcePreview.naturalHeight - config.rahmenBottom), bounds.width, config.rahmenBottom, config.rahmenBottom > 0);
    setOverlayRect(gapLeftOverlay, Math.max(0, bounds.left - config.gapLeft), bounds.top, config.gapLeft, bounds.height, config.gapLeft > 0);
    setOverlayRect(gapRightOverlay, bounds.left + bounds.width, bounds.top, config.gapRight, bounds.height, config.gapRight > 0);
    setOverlayRect(gapTopOverlay, bounds.left, Math.max(0, bounds.top - config.gapTop), bounds.width, config.gapTop, config.gapTop > 0);
    setOverlayRect(gapBottomOverlay, bounds.left, bounds.top + bounds.height, bounds.width, config.gapBottom, config.gapBottom > 0);
}

function showHoverTooltip(event, key) {
    if (!hoverTooltip) {
        return;
    }
    if (tooltipTimer) {
        window.clearTimeout(tooltipTimer);
    }
    hoverTooltip.textContent = tooltipDescriptions[key] || '';
    hoverTooltip.style.left = `${Math.round(event.offsetX + 12)}px`;
    hoverTooltip.style.top = `${Math.round(event.offsetY + 12)}px`;
    hoverTooltip.style.display = 'block';
    tooltipTimer = window.setTimeout(function () {
        if (hoverTooltip) {
            hoverTooltip.style.display = 'none';
        }
    }, 2600);
}

function hideHoverTooltip() {
    if (!hoverTooltip) {
        return;
    }
    if (tooltipTimer) {
        window.clearTimeout(tooltipTimer);
        tooltipTimer = null;
    }
    hoverTooltip.style.display = 'none';
}

function syncInspectorSurface() {
    if (!inspectorSurface || !sourcePreview || !sourcePreview.naturalWidth || !sourcePreview.naturalHeight) {
        return;
    }
    const scaledWidth = Math.max(1, Math.round(sourcePreview.naturalWidth * config.zoom));
    const scaledHeight = Math.max(1, Math.round(sourcePreview.naturalHeight * config.zoom));
    inspectorSurface.style.width = `${scaledWidth}px`;
    inspectorSurface.style.height = `${scaledHeight}px`;
    sourcePreview.style.width = `${scaledWidth}px`;
    sourcePreview.style.height = `${scaledHeight}px`;
}

function getImagePoint(event) {
    if (!sourcePreview || !inspectorSurface) {
        return null;
    }
    const rect = inspectorSurface.getBoundingClientRect();
    if (rect.width <= 0 || rect.height <= 0) {
        return null;
    }
    const scaledX = clamp(event.clientX - rect.left, 0, rect.width);
    const scaledY = clamp(event.clientY - rect.top, 0, rect.height);
    const naturalX = clamp(scaledX / config.zoom, 0, sourcePreview.naturalWidth);
    const naturalY = clamp(scaledY / config.zoom, 0, sourcePreview.naturalHeight);
    return {
        scaledX,
        scaledY,
        naturalX,
        naturalY,
        rect
    };
}

function updateDragBox(startPoint, endPoint) {
    if (!dragBox) {
        return;
    }
    const left = Math.min(startPoint.scaledX, endPoint.scaledX);
    const top = Math.min(startPoint.scaledY, endPoint.scaledY);
    const width = Math.abs(endPoint.scaledX - startPoint.scaledX);
    const height = Math.abs(endPoint.scaledY - startPoint.scaledY);
    dragBox.style.left = `${left}px`;
    dragBox.style.top = `${top}px`;
    dragBox.style.width = `${width}px`;
    dragBox.style.height = `${height}px`;
    dragBox.style.display = 'block';
}

function updateInspectorStatus() {
    if (!inspectorStatus || !sourcePreview) {
        return;
    }
    const origin = getTileOrigin();
    inspectorStatus.textContent = `Zoom ${Math.round(config.zoom * 100)}% | tile ${config.gridW}x${config.gridH} | first tile ${origin.x},${origin.y} | frame ${config.rahmenLeft},${config.rahmenTop} | gap ${config.gapLeft}/${config.gapRight}/${config.gapTop}/${config.gapBottom}`;
}

function updateSelectionBoxFromConfig() {
    if (!selectionBox || !sourcePreview || !sourcePreview.naturalWidth || !sourcePreview.naturalHeight) {
        return;
    }
    const bounds = getSelectionBounds();
    selectionBox.style.left = `${Math.round(bounds.left * config.zoom)}px`;
    selectionBox.style.top = `${Math.round(bounds.top * config.zoom)}px`;
    selectionBox.style.width = `${Math.max(1, Math.round(bounds.width * config.zoom))}px`;
    selectionBox.style.height = `${Math.max(1, Math.round(bounds.height * config.zoom))}px`;
    selectionBox.style.display = 'block';
    updateOffsetOverlays();
    updateInspectorStatus();
}

function drawGridOverlay() {
    if (!gridOverlay || !sourcePreview || !sourcePreview.naturalWidth || !sourcePreview.naturalHeight) {
        return;
    }
    const scaledWidth = Math.max(1, Math.round(sourcePreview.naturalWidth * config.zoom));
    const scaledHeight = Math.max(1, Math.round(sourcePreview.naturalHeight * config.zoom));
    gridOverlay.width = scaledWidth;
    gridOverlay.height = scaledHeight;
    gridOverlay.style.width = `${scaledWidth}px`;
    gridOverlay.style.height = `${scaledHeight}px`;
    const overlayCtx = gridOverlay.getContext('2d');
    if (!overlayCtx) {
        return;
    }
    overlayCtx.clearRect(0, 0, scaledWidth, scaledHeight);
    if (config.gridW <= 0 || config.gridH <= 0) {
        return;
    }
    const calc = new CalcTile();
    calc.calcRowAndColumns(
        sourcePreview.naturalWidth,
        sourcePreview.naturalHeight,
        config.gridW,
        config.gridH,
        config.rahmenLeft,
        config.rahmenRight,
        config.rahmenTop,
        config.rahmenBottom,
        config.gapLeft,
        config.gapRight,
        config.gapTop,
        config.gapBottom
    );
    overlayCtx.strokeStyle = 'rgba(125, 255, 155, 0.42)';
    overlayCtx.lineWidth = 1;
    for (let row = 0; row < calc.rows; row++) {
        for (let col = 0; col < calc.columns; col++) {
            const srcX = config.rahmenLeft + config.gapLeft + col * (config.gridW + config.gapLeft + config.gapRight);
            const srcY = config.rahmenTop + config.gapTop + row * (config.gridH + config.gapTop + config.gapBottom);
            const x = Math.round(srcX * config.zoom) + 0.5;
            const y = Math.round(srcY * config.zoom) + 0.5;
            const width = Math.max(1, Math.round(config.gridW * config.zoom) - 1);
            const height = Math.max(1, Math.round(config.gridH * config.zoom) - 1);
            overlayCtx.strokeRect(x, y, width, height);
        }
    }
}

function refreshInspector() {
    syncInspectorSurface();
    drawGridOverlay();
    updateSelectionBoxFromConfig();
}

function scrollSelectionIntoView() {
    if (!inspectorViewport || !selectionBox) {
        return;
    }
    const left = selectionBox.offsetLeft;
    const top = selectionBox.offsetTop;
    const right = left + selectionBox.offsetWidth;
    const bottom = top + selectionBox.offsetHeight;
    if (left < inspectorViewport.scrollLeft) {
        inspectorViewport.scrollLeft = left;
    } else if (right > inspectorViewport.scrollLeft + inspectorViewport.clientWidth) {
        inspectorViewport.scrollLeft = right - inspectorViewport.clientWidth;
    }
    if (top < inspectorViewport.scrollTop) {
        inspectorViewport.scrollTop = top;
    } else if (bottom > inspectorViewport.scrollTop + inspectorViewport.clientHeight) {
        inspectorViewport.scrollTop = bottom - inspectorViewport.clientHeight;
    }
}

function applySelectionRect(left, top, width, height) {
    if (!sourcePreview) {
        return;
    }
    const nextLeft = clamp(Math.round(left), 0, Math.max(0, sourcePreview.naturalWidth - 1));
    const nextTop = clamp(Math.round(top), 0, Math.max(0, sourcePreview.naturalHeight - 1));
    const maxWidth = Math.max(1, sourcePreview.naturalWidth - nextLeft);
    const maxHeight = Math.max(1, sourcePreview.naturalHeight - nextTop);
    const nextWidth = clamp(Math.round(width), 1, maxWidth);
    const nextHeight = clamp(Math.round(height), 1, maxHeight);
    setFieldValue('gridW', nextWidth);
    setFieldValue('gridH', nextHeight);
    setFieldValue('rahmenLeft', Math.max(0, nextLeft - config.gapLeft));
    setFieldValue('rahmenTop', Math.max(0, nextTop - config.gapTop));
    scheduleRender(true);
    requestAnimationFrame(scrollSelectionIntoView);
}

function applySelectionEdges(left, top, right, bottom) {
    const nextLeft = Math.min(left, right - 1);
    const nextTop = Math.min(top, bottom - 1);
    applySelectionRect(nextLeft, nextTop, Math.max(1, right - nextLeft), Math.max(1, bottom - nextTop));
}

function moveOverlayByPixels(dx, dy) {
    if (!sourcePreview) {
        return;
    }
    const origin = getTileOrigin();
    const nextX = clamp(origin.x + dx, 0, Math.max(0, sourcePreview.naturalWidth - config.gridW));
    const nextY = clamp(origin.y + dy, 0, Math.max(0, sourcePreview.naturalHeight - config.gridH));
    setFieldValue('rahmenLeft', Math.max(0, Math.round(nextX) - config.gapLeft));
    setFieldValue('rahmenTop', Math.max(0, Math.round(nextY) - config.gapTop));
    scheduleRender(true);
}

function beginSelection(event) {
    if (!sourcePreview || event.button !== 0) {
        return;
    }
    const point = getImagePoint(event);
    if (!point) {
        return;
    }
    activePointerMode = 'select';
    selectionStart = point;
    updateDragBox(point, point);
}

function moveSelection(event) {
    if (activePointerMode !== 'select' || !selectionStart) {
        return;
    }
    const point = getImagePoint(event);
    if (!point) {
        return;
    }
    updateDragBox(selectionStart, point);
}

function endSelection(event) {
    if (activePointerMode !== 'select' || !selectionStart) {
        return;
    }
    const point = getImagePoint(event);
    if (dragBox) {
        dragBox.style.display = 'none';
    }
    activePointerMode = null;
    if (!point) {
        selectionStart = null;
        return;
    }
    const width = Math.abs(point.naturalX - selectionStart.naturalX);
    const height = Math.abs(point.naturalY - selectionStart.naturalY);
    if (width < MIN_SELECTION_PIXELS && height < MIN_SELECTION_PIXELS) {
        applySelectionRect(point.naturalX, point.naturalY, config.gridW, config.gridH);
        selectionStart = null;
        return;
    }
    const left = Math.min(selectionStart.naturalX, point.naturalX);
    const top = Math.min(selectionStart.naturalY, point.naturalY);
    applySelectionRect(left, top, Math.max(1, width), Math.max(1, height));
    selectionStart = null;
}

function beginResize(event, handle) {
    if (!sourcePreview || event.button !== 0) {
        return;
    }
    const point = getImagePoint(event);
    if (!point) {
        return;
    }
    const edges = getSelectionEdges();
    activePointerMode = 'resize';
    resizeState = {
        handle,
        startPoint: point,
        startEdges: edges
    };
    selectionBox.classList.add('is-resizing');
}

function moveResize(event) {
    if (activePointerMode !== 'resize' || !resizeState) {
        return;
    }
    const point = getImagePoint(event);
    if (!point) {
        return;
    }
    const deltaX = point.naturalX - resizeState.startPoint.naturalX;
    const deltaY = point.naturalY - resizeState.startPoint.naturalY;
    let { left, top, right, bottom } = resizeState.startEdges;
    if (resizeState.handle.includes('w')) {
        left = clamp(left + deltaX, 0, right - 1);
    }
    if (resizeState.handle.includes('e')) {
        right = clamp(right + deltaX, left + 1, sourcePreview.naturalWidth);
    }
    if (resizeState.handle.includes('n')) {
        top = clamp(top + deltaY, 0, bottom - 1);
    }
    if (resizeState.handle.includes('s')) {
        bottom = clamp(bottom + deltaY, top + 1, sourcePreview.naturalHeight);
    }
    const nextLeft = Math.round(left);
    const nextTop = Math.round(top);
    const nextWidth = Math.max(1, Math.round(right - left));
    const nextHeight = Math.max(1, Math.round(bottom - top));
    setFieldValue('gridW', nextWidth);
    setFieldValue('gridH', nextHeight);
    setFieldValue('rahmenLeft', Math.max(0, nextLeft - config.gapLeft));
    setFieldValue('rahmenTop', Math.max(0, nextTop - config.gapTop));
    refreshInspector();
}

function beginOverlayAdjust(event, kind, side) {
    if (!sourcePreview || event.button !== 0) {
        return;
    }
    const point = getImagePoint(event);
    if (!point) {
        return;
    }
    activePointerMode = 'overlay-adjust';
    overlayAdjustState = {
        kind,
        side,
        startPoint: point,
        startValue: getOverlayValue(kind, side)
    };
    const element = event.currentTarget;
    if (element) {
        element.classList.add('is-dragging');
    }
}

function moveOverlayAdjust(event) {
    if (activePointerMode !== 'overlay-adjust' || !overlayAdjustState) {
        return;
    }
    const point = getImagePoint(event);
    if (!point) {
        return;
    }
    const deltaX = point.naturalX - overlayAdjustState.startPoint.naturalX;
    const deltaY = point.naturalY - overlayAdjustState.startPoint.naturalY;
    let nextValue = overlayAdjustState.startValue;
    if (overlayAdjustState.kind === 'frame') {
        if (overlayAdjustState.side === 'left') {
            nextValue = overlayAdjustState.startValue + deltaX;
        } else if (overlayAdjustState.side === 'right') {
            nextValue = overlayAdjustState.startValue - deltaX;
        } else if (overlayAdjustState.side === 'top') {
            nextValue = overlayAdjustState.startValue + deltaY;
        } else if (overlayAdjustState.side === 'bottom') {
            nextValue = overlayAdjustState.startValue - deltaY;
        }
    } else {
        if (overlayAdjustState.side === 'left') {
            nextValue = overlayAdjustState.startValue - deltaX;
        } else if (overlayAdjustState.side === 'right') {
            nextValue = overlayAdjustState.startValue + deltaX;
        } else if (overlayAdjustState.side === 'top') {
            nextValue = overlayAdjustState.startValue - deltaY;
        } else if (overlayAdjustState.side === 'bottom') {
            nextValue = overlayAdjustState.startValue + deltaY;
        }
    }
    const limit = getOverlayLimit(overlayAdjustState.kind, overlayAdjustState.side);
    setOverlayValue(overlayAdjustState.kind, overlayAdjustState.side, clamp(Math.round(nextValue), 0, limit));
    refreshInspector();
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

function normalizeConfigForImage() {
    if (!myImage.complete || myImage.naturalWidth === 0 || myImage.naturalHeight === 0) {
        return;
    }
    const maxWidth = Math.max(1, myImage.naturalWidth);
    const maxHeight = Math.max(1, myImage.naturalHeight);
    const nextGridW = clamp(config.gridW, 1, maxWidth);
    const nextGridH = clamp(config.gridH, 1, maxHeight);
    if (nextGridW !== config.gridW) {
        setFieldValue('gridW', nextGridW);
    }
    if (nextGridH !== config.gridH) {
        setFieldValue('gridH', nextGridH);
    }
    const origin = getTileOrigin();
    const nextOriginX = clamp(origin.x, 0, Math.max(0, maxWidth - config.gridW));
    const nextOriginY = clamp(origin.y, 0, Math.max(0, maxHeight - config.gridH));
    const nextFrameLeft = Math.max(0, nextOriginX - config.gapLeft);
    const nextFrameTop = Math.max(0, nextOriginY - config.gapTop);
    if (nextFrameLeft !== config.rahmenLeft) {
        setFieldValue('rahmenLeft', nextFrameLeft);
    }
    if (nextFrameTop !== config.rahmenTop) {
        setFieldValue('rahmenTop', nextFrameTop);
    }
    ['left', 'right', 'top', 'bottom'].forEach(function (side) {
        const frameValue = getOverlayValue('frame', side);
        const gapValue = getOverlayValue('gap', side);
        const frameLimit = getOverlayLimit('frame', side);
        const gapLimit = getOverlayLimit('gap', side);
        if (frameValue !== clamp(frameValue, 0, frameLimit)) {
            setOverlayValue('frame', side, clamp(frameValue, 0, frameLimit));
        }
        if (gapValue !== clamp(gapValue, 0, gapLimit)) {
            setOverlayValue('gap', side, clamp(gapValue, 0, gapLimit));
        }
    });
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
    normalizeConfigForImage();
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
        activePointerMode = null;
        selectionStart = null;
        resizeState = null;
        overlayAdjustState = null;
        if (dragBox) {
            dragBox.style.display = 'none';
        }
        if (selectionBox) {
            selectionBox.classList.remove('is-dragging');
            selectionBox.classList.remove('is-resizing');
        }
        offsetOverlays.forEach(function (overlay) {
            if (overlay.element) {
                overlay.element.classList.remove('is-dragging');
            }
        });
        hideHoverTooltip();
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
if (zoomOutButton) zoomOutButton.addEventListener('click', function () { updateZoom(-0.25); });
if (zoomResetButton) zoomResetButton.addEventListener('click', function () { config.zoom = 1; applyZoom(); });
if (zoomInButton) zoomInButton.addEventListener('click', function () { updateZoom(0.25); });
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
    selectionBox.querySelectorAll('[data-resize-handle]').forEach(function (handle) {
        handle.addEventListener('mousedown', function (event) {
            event.preventDefault();
            event.stopPropagation();
            beginResize(event, handle.dataset.resizeHandle || '');
        });
    });
    selectionBox.addEventListener('mousedown', function (event) {
        event.preventDefault();
        event.stopPropagation();
        activePointerMode = 'move';
        selectionBox.classList.add('is-dragging');
        const point = getImagePoint(event);
        if (!point) {
            return;
        }
        const origin = getTileOrigin();
        dragOffset = {
            x: point.naturalX - origin.x,
            y: point.naturalY - origin.y
        };
    });
}
offsetOverlays.forEach(function (overlay) {
    if (!overlay.element) {
        return;
    }
    overlay.element.addEventListener('mousedown', function (event) {
        event.preventDefault();
        event.stopPropagation();
        beginOverlayAdjust(event, overlay.kind, overlay.side);
    });
    overlay.element.addEventListener('mouseenter', function (event) {
        showHoverTooltip(event, `${overlay.kind}-${overlay.side}`);
    });
    overlay.element.addEventListener('mousemove', function (event) {
        if (hoverTooltip && hoverTooltip.style.display === 'block') {
            hoverTooltip.style.left = `${Math.round(event.offsetX + 12)}px`;
            hoverTooltip.style.top = `${Math.round(event.offsetY + 12)}px`;
        }
    });
    overlay.element.addEventListener('mouseleave', hideHoverTooltip);
});
document.addEventListener('mousemove', moveSelection);
document.addEventListener('mouseup', endSelection);
document.addEventListener('keydown', function (event) {
    if (event.target && (event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA' || event.target.tagName === 'SELECT' || event.target.isContentEditable)) {
        return;
    }
    if (getViewMode() === 'help') {
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
if (inspectorViewport) {
    inspectorViewport.addEventListener('wheel', function (event) {
        if (!event.ctrlKey && !event.metaKey) {
            return;
        }
        event.preventDefault();
        updateZoom(event.deltaY < 0 ? 0.25 : -0.25);
    }, { passive: false });
}

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
    if (activePointerMode !== 'move' || !dragOffset) {
        return;
    }
    const point = getImagePoint(event);
    if (!point) {
        return;
    }
    const maxX = Math.max(0, sourcePreview.naturalWidth - config.gridW);
    const maxY = Math.max(0, sourcePreview.naturalHeight - config.gridH);
    const targetX = clamp(point.naturalX - dragOffset.x, 0, maxX);
    const targetY = clamp(point.naturalY - dragOffset.y, 0, maxY);
    setFieldValue('rahmenLeft', Math.max(0, Math.round(targetX) - config.gapLeft));
    setFieldValue('rahmenTop', Math.max(0, Math.round(targetY) - config.gapTop));
    refreshInspector();
});
document.addEventListener('mousemove', moveResize);
document.addEventListener('mousemove', moveOverlayAdjust);
document.addEventListener('mouseup', function () {
    if (activePointerMode === 'move') {
        scheduleRender(true);
    }
    if (activePointerMode === 'resize') {
        scheduleRender(true);
    }
    if (activePointerMode === 'overlay-adjust') {
        scheduleRender(true);
    }
    activePointerMode = null;
    dragOffset = null;
    resizeState = null;
    overlayAdjustState = null;
    if (selectionBox) {
        selectionBox.classList.remove('is-dragging');
        selectionBox.classList.remove('is-resizing');
    }
    offsetOverlays.forEach(function (overlay) {
        if (overlay.element) {
            overlay.element.classList.remove('is-dragging');
        }
    });
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
