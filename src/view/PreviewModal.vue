<template>
    <a-modal v-model:open="open" title="HTML预览" width="800px" class="preview-modal" zIndex="999999">
        <div class="preview-container">
            <div class="preview-actions">
                <!-- <a-button type="primary" @click="copyHtml" :loading="isGenerating">复制HTML</a-button> -->
                <a-input v-model:value="downloadName" placeholder="请输入下载文件名" style="width: 200px">
                    <template #addonBefore>
                        <span>文件名</span>
                    </template>
                </a-input>
                <a-button @click="downloadHtml" :loading="isGenerating">下载HTML</a-button>
            </div>
            <div class="code-container">
                <pre>{{ generatedHtml || '点击上方按钮生成HTML...' }}</pre>
            </div>
        </div>
    </a-modal>
</template>

<script setup>
import { ref, watch } from 'vue';
import { message } from 'ant-design-vue';

const props = defineProps({
    items: {
        type: Array,
        required: true,
        default: () => []
    }
});

const open = defineModel('open');
const generatedHtml = ref('');
const isGenerating = ref(false);
const downloadName = ref('brand-story');

// 获取图片实际尺寸
const getImageDimensions = (src) => {
    return new Promise((resolve) => {
        if (!src) {
            resolve({ width: 750, height: 1366 });
            return;
        }
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => {
            resolve({
                width: img.naturalWidth,
                height: img.naturalHeight
            });
        };
        img.onerror = () => {
            console.warn('图片加载失败，使用默认尺寸:', src);
            resolve({ width: 750, height: 1366 });
        };
        img.src = src;
    });
};

// 生成HTML内容
const generateHtml = async (items) => {
    let html = `<!doctype html>
<html>
<head>
    <meta charset="utf-8">
    <title>品牌故事</title>
</head>
<body>
    <style>
        * { margin: 0; padding: 0 }
        html, body { overflow-x: hidden; }
        a, map, map area { outline: none; }
        a:active, a:focus { outline: none; }
        .clarBox { margin: 0 auto; width: 750px }
        .clarBox p { line-height: 0; font-size: 0 }
        .clarList { margin: 0; padding: 0; clear: both; zoom: 1; overflow: hidden }
        .clarList li { float: left; line-height: 0; font-size: 0; list-style-type: none; position: relative }
        .swiper-container { width: 750px; height: 1388px; }
        .swiper-container2 { width: 750px; height: 1528px; }
        .swiper-pagination-bullet { width: 40px; height: 40px; }
        .toLink { position: absolute; bottom: 0; left: 0; right: 0; height: 200px; }
        .video {
    width: 750px!important;
    height: 400px;
    margin: 0 auto
}
    </style>
    <script src="https://ssl1.sephorastatic.cn/soa/public/js/jquery/3.4.1/jquery.min.js"><\/script>
    <link rel="stylesheet" href="https://s1.sephorastatic.cn/wcsfrontend/campaign/mobile_img/2018/05/exclusivesale/swiper-4.2.6.min.css">
    <div class="clarBox">
        <ul class="clarList">`;

    // 计数器用于区分不同轮播实例
    let swiperCounter = 1;
    let videoids = [];

    for (const [index, item] of items.entries()) {
        if (item.type === 'image' && item.imageUrl) {
            // 单图组件处理
            try {
                const dimensions = await getImageDimensions(item.imageUrl);

                html += `
            <li>
                <img src="${item.imageUrl || ''}" alt="" usemap="#Map${index}" />
                <map name="Map${index}">`;

                // 全图热区
                if (item.link) {
                    html += `
                    <area shape="rect" 
                          coords="0,0,${dimensions.width},${dimensions.height}" 
                          href="${item.link}" 
                          target="_blank">`;
                }

                // 自定义热区
                item.hotspots?.forEach(hotspot => {
                    const { x, y, width, height } = hotspot;
                    html += `
                    <area shape="rect" 
                          coords="${x},${y},${width},${height}" 
                          href="${hotspot.link || '#'}" 
                          target="_blank">`;
                });

                html += `
                </map>
            </li>`;
            } catch (error) {
                console.error('图片处理失败:', error);
                html += `
            <li>
                <img src="${item.imageUrl || ''}" alt="" />
            </li>`;
            }
        } else if (item.type === 'swiper' && item.images.length > 0) {
            // 轮播组件处理
            html += `
            <div class="swiper-container swiper-container${swiperCounter}">
                <div class="swiper-wrapper">`;

            for (const [slideIndex, slide] of (item.images || []).entries()) {
                try {
                    const dimensions = await getImageDimensions(slide.imageUrl);

                    html += `
                    <div class="swiper-slide">
                        <img src="${slide.imageUrl || ''}" alt="" usemap="#Map${index}${slideIndex}" />
                        <map name="Map${index}${slideIndex}">`;

                    // 幻灯片全图热区
                    if (slide.link) {
                        html += `
                            <area shape="rect" 
                                  alt="${index}${slideIndex}"
                                  coords="0,0,${dimensions.width},${dimensions.height}" 
                                  href="${slide.link}" 
                                  target="_blank">`;
                    }

                    // 幻灯片自定义热区
                    slide.hotspots?.forEach(hotspot => {
                        const { x, y, width, height } = hotspot;
                        html += `
                            <area shape="rect" 
                                  alt="${index}${slideIndex}"
                                  coords="${x},${y},${width},${height}" 
                                  href="${hotspot.link || '#'}" 
                                  target="_blank">`;
                    });

                    html += `
                        </map>
                    </div>`;
                } catch (error) {
                    console.error('轮播图片处理失败:', error);
                    html += `
                    <div class="swiper-slide">
                        <img src="${slide.imageUrl || ''}" alt="" />
                    </div>`;
                }
            }

            html += `
                </div>
                <div class="swiper-pagination swiper-pagination-${swiperCounter}"></div>
            </div>`;

            swiperCounter++;
        } else if (item.type === 'video' && item.videoId) {
            // 视频组件处理
            html += `
            <div class="video video${item.videoId}"></div>`;
            videoids.push(item.videoId);
        }
    }

    html += `
        </ul >
    </div >
    <script src="https://ssl1.sephorastatic.cn/wcsfrontend/brandm/burberry/burberry.js"><\/script>
        <script>
            $(function () {
                $.when(
                    $.getScript('https://s1.sephorastatic.cn/wcsfrontend/campaign/mobile_img/2018/05/exclusivesale/swiper-4.2.6.min.js'),
                    $.getScript('https://ssl1.sephorastatic.cn/html/mp/sephora/base-wx/toUrl/invokeToUrl.js')
                ).then(function () {
                    `;
    for (let i = 1; i < swiperCounter; i++) {
        html += `;
                    var mySwiper${i} = new Swiper('.swiper-container${i}', {
                        direction: 'horizontal',
                        pagination: {
                            el: '.swiper-pagination-${i}',
                        },
                        observer: true,
                        autoHeight: true,
                    }); `;
    }


    html += `;
                });`;
    for (let i = 0; i < videoids.length; i++) {
        html += `
        addVideo(".video${videoids[i]}","${videoids[i]}");`;
    }
    html += `
            function addVideo(element, id) {
                var script = document.createElement('script');
            script.type = 'text/javascript';
            script.src = 'https://p.bokecc.com/player?vid=' + id + '&siteid=DB5E63A2AD1D502A&autoStart=false&width=100%&height=100%&playerid=D7B7B7BC72E672DA&playertype=1';
            var video1 = document.querySelectorAll(element);
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
        })
            <\/script>
        </body>
    </html>`;

    return html;
};

// 生成HTML并更新状态
const generateHtmlContent = async () => {
    try {
        isGenerating.value = true;
        generatedHtml.value = await generateHtml(props.items);
    } catch (error) {
        console.error('生成HTML失败:', error);
        message.error('生成HTML失败');
        generatedHtml.value = '生成HTML时出错';
    } finally {
        isGenerating.value = false;
    }
};

// 复制HTML
const copyHtml = async () => {
    await generateHtmlContent();
    // try {
    //     await navigator.clipboard.writeText(generatedHtml.value);
    //     message.success('已复制到剪贴板');
    // } catch (err) {
    //     message.error('复制失败');
    //     console.error(err);
    // }
};

watch(open, (newVal) => {
    if (newVal) {
        generateHtmlContent();
    }
});

// 下载HTML
const downloadHtml = async () => {
    await generateHtmlContent();
    try {
        const blob = new Blob([generatedHtml.value], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${downloadName.value}.html`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        message.success('下载成功');
    } catch (err) {
        message.error('下载失败');
        console.error(err);
    }
};
;;</script>

<style scoped>
.preview-modal :deep(.ant-modal-body) {
    padding: 0;
}

.preview-container {
    display: flex;
    flex-direction: column;
    height: 600px;
}

.preview-actions {
    padding: 16px;
    display: flex;
    gap: 8px;
    border-bottom: 1px solid #f0f0f0;
}

.code-container {
    flex: 1;
    overflow: auto;
    padding: 16px;
    background: #f5f5f5;
}

pre {
    margin: 0;
    white-space: pre-wrap;
    word-wrap: break-word;
    font-family: monospace;
}
</style>