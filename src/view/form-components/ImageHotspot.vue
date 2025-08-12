<template>
    <a-modal v-model:open="open" title="热区编辑" width="800px" cancelText="取消" okText="确定" @ok="handleOk">
        <div class="hotspot-editor">
            <div class="image-container" ref="imageContainer" @mousedown="handleMouseDown" @mousemove="handleMouseMove" @mouseup="handleMouseUp" @mouseleave="handleMouseLeave">
                <img :src="imageUrl" class="target-image" />

                <!-- 正在绘制的热区 -->
                <div v-if="drawingRect" class="hotspot drawing" :style="getRectStyle(drawingRect)"></div>

                <!-- 已创建的热区 -->
                <div v-for="(hotspot, index) in hotspots" :key="hotspot.id" class="hotspot" :style="getRectStyle(hotspot)" @mousedown="startDrag(index, $event)">
                    <span class="hotspot-label">热区 {{ index + 1 }}</span>
                    <button class="hotspot-delete" @click.stop="removeHotspot(index)">×</button>
                </div>
            </div>

            <div class="controls">
                <a-button @click="clearAll">清空所有热区</a-button>
            </div>
        </div>
    </a-modal>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watchEffect } from 'vue';

const props = defineProps({
    imageUrl: String,
    item: Object,
});

const open = defineModel('open');
const imageContainer = ref(null);
const hotspots = ref([]);

// 绘制状态
const drawingRect = ref(null);
const isDrawing = ref(false);
const startPos = ref({ x: 0, y: 0 });

// 拖拽状态
const isDragging = ref(false);
const draggingIndex = ref(-1);
const dragOffset = ref({ x: 0, y: 0 });

// 阻止默认选中行为
const preventDefault = (e) => {
    if (isDrawing.value || isDragging.value) {
        e.preventDefault();
    }
};

onMounted(() => {
    document.addEventListener('selectstart', preventDefault);
});

onUnmounted(() => {
    document.removeEventListener('selectstart', preventDefault);
});

// 鼠标按下事件
const handleMouseDown = (e) => {
    if (e.target === imageContainer.value) {
        startDrawing(e);
    }
    e.preventDefault();
};

// 开始绘制
const startDrawing = (e) => {
    const rect = imageContainer.value.getBoundingClientRect();
    startPos.value = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
    };

    drawingRect.value = {
        x: startPos.value.x,
        y: startPos.value.y,
        width: 0,
        height: 0
    };

    isDrawing.value = true;
};

// 处理绘制
const handleDrawing = (e) => {
    const rect = imageContainer.value.getBoundingClientRect();
    const currentX = e.clientX - rect.left;
    const currentY = e.clientY - rect.top;

    drawingRect.value = {
        x: Math.min(startPos.value.x, currentX),
        y: Math.min(startPos.value.y, currentY),
        width: Math.abs(currentX - startPos.value.x),
        height: Math.abs(currentY - startPos.value.y)
    };
    e.preventDefault();
};

// 结束绘制
const endDrawing = () => {
    if (drawingRect.value?.width > 5 && drawingRect.value?.height > 5) {
        hotspots.value.push({
            ...drawingRect.value,
            id: Date.now() + Math.random()
        });
    }
    cancelDrawing();
};

// 取消绘制
const cancelDrawing = () => {
    isDrawing.value = false;
    drawingRect.value = null;
};

// 开始拖拽热区
const startDrag = (index, e) => {
    const rect = imageContainer.value.getBoundingClientRect();
    const hotspot = hotspots.value[index];

    dragOffset.value = {
        x: e.clientX - rect.left - hotspot.x,
        y: e.clientY - rect.top - hotspot.y
    };

    draggingIndex.value = index;
    isDragging.value = true;
    e.preventDefault();
};

// 处理拖拽
const handleDragging = (e) => {
    const rect = imageContainer.value.getBoundingClientRect();
    const newX = e.clientX - rect.left - dragOffset.value.x;
    const newY = e.clientY - rect.top - dragOffset.value.y;

    hotspots.value[draggingIndex.value].x = newX;
    hotspots.value[draggingIndex.value].y = newY;
    e.preventDefault();
};

// 结束拖拽
const endDrag = () => {
    isDragging.value = false;
    draggingIndex.value = -1;
};

// 统一鼠标移动处理
const handleMouseMove = (e) => {
    if (isDrawing.value) {
        handleDrawing(e);
    } else if (isDragging.value) {
        handleDragging(e);
    }
    e.preventDefault();
};

// 统一鼠标释放处理
const handleMouseUp = () => {
    if (isDrawing.value) {
        endDrawing();
    } else if (isDragging.value) {
        endDrag();
    }
};

// 鼠标离开容器
const handleMouseLeave = () => {
    if (isDrawing.value) {
        cancelDrawing();
    } else if (isDragging.value) {
        endDrag();
    }
};

// 删除热区
const removeHotspot = (index) => {
    hotspots.value.splice(index, 1);
};

// 清空所有热区
const clearAll = () => {
    hotspots.value = [];
};

// 获取矩形样式
const getRectStyle = (rect) => {
    return {
        left: `${rect.x}px`,
        top: `${rect.y}px`,
        width: `${rect.width}px`,
        height: `${rect.height}px`,
        cursor: isDragging.value ? 'grabbing' : 'grab'
    };
};

const handleOk = () => {
    props.item.hotspots = [...hotspots.value];
    open.value = false;
};

watchEffect(() => {
    if (open.value) {
        hotspots.value = [...props.item.hotspots || []];
    }
});
</script>

<style scoped>
.hotspot-editor {
    display: flex;
    flex-direction: column;
    gap: 16px;
}

.image-container {
    position: relative;
    width: 750px;
    border: 1px solid #eee;
    overflow: hidden;
    cursor: crosshair;
    user-select: none;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    -webkit-touch-callout: none;
    -webkit-tap-highlight-color: transparent;
}

.target-image {
    width: 750px;
    height: auto;
    object-fit: contain;
    pointer-events: none;
    user-select: none;
}

.hotspot {
    position: absolute;
    border: 2px dashed #000;
    background-color: rgba(255, 255, 255, 0.5);
    cursor: grab;
    user-select: none;
    -webkit-user-drag: none;
}

.hotspot.drawing {
    border: 2px dashed rgba(0, 0, 255, 0.7);
    background-color: rgba(0, 0, 255, 0.2);
}

.hotspot-label {
    position: absolute;
    top: 0;
    left: 0;
    background: white;
    padding: 2px 5px;
    font-size: 12px;
    user-select: none;
}

.hotspot-delete {
    position: absolute;
    top: 0;
    right: 0;
    width: 20px;
    height: 20px;
    background: red;
    color: white;
    border: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    user-select: none;
}

.controls {
    display: flex;
    justify-content: flex-end;
}
</style>