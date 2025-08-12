<template>
    <div class="single-video component-item" :class="{ 'active': activeId === item.id }">
        <div class="video-container" v-if="item.videoId" :id="item.id">

        </div>
        <span v-else>视频组件</span>
    </div>
</template>

<script setup>
import { watchEffect, nextTick } from 'vue';
const props = defineProps({
    activeId: {
        type: String,
        default: '',
    },
    item: {
        type: Object,
        default: () => ({}),
    },
});


function addVideo() {
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = 'https://p.bokecc.com/player?vid=' + props.item.videoId + '&siteid=DB5E63A2AD1D502A&autoStart=false&width=100%&height=100%&playerid=D7B7B7BC72E672DA&playertype=1';
    var video1 = document.querySelectorAll('#' + props.item.id);
    video1[0].appendChild(script);
    var videoclone1 = script.cloneNode(true);
    if (video1[1]) {
        if (window.navigator.userAgent.indexOf('sephora') !== -1) {
            video1[1].appendChild(script);
        } else {
            video1[1].appendChild(videoclone1);
        }
    }

}

watchEffect(() => {
    if (props.item.videoId) {
        nextTick(() => {
            addVideo();
        });
    }
});
</script>

<style lang="scss" scoped>
.single-video {
    width: 100%;
    min-height: 100px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.video-container {
    width: 100%;
    height: 200px;
}
</style>