let input;
let slider;
let button;
let isBouncing = false; // 控制是否跳動的狀態變數
let iframeDiv;
let dropdown; // 新增下拉式選單變數
let embeddedFrame; // 提升為全域變數，以便於在其他函數中更新網址

// 定義色票陣列，並修正了長度不足的色碼以確保正常顯示
const palette = ['#880d1e', '#dd2d4a', '#f26a8d', '#f49cbb', '#cbeef3', '#06bd60', '#f7ede2', '#f5cac3', '#84a59d', '#f28482'];

function setup() {
  createCanvas(windowWidth, windowHeight);

  // 設定文字的垂直對齊方式為靠上對齊，方便控制頂部邊界
  textAlign(LEFT, TOP);

  // 建立一個文字輸入框並設定其位置
  input = createInput('輸入文字');
  input.position(50, 50);
  input.size(300, 50);
  input.style('font-size', '30px');

  // 建立滑桿，範圍 15 到 80，預設值為 30
  slider = createSlider(15, 80, 30);
  // 將滑桿放置在輸入框的右邊 (50 + 300 + 20 = 370)，並垂直微調置中 (50 + 25 - 10 = 65)
  slider.position(370, 65);

  // 建立按鈕，放置在滑桿右邊 20px 處
  // 預設滑桿寬度約為 130px，所以 X 座標 = 370 + 130 + 20 = 520
  button = createButton('扭動');
  button.position(520, 65);
  button.style('font-size', '16px'); // 設定一下按鈕的字體大小
  button.mousePressed(toggleBounce); // 設定按下按鈕時觸發的函數

  // 建立下拉式選單，放置在按鈕的右邊 (520 + 預估按鈕寬度約 60 + 20 px 間距 = 600)
  dropdown = createSelect();
  dropdown.position(600, 65);
  dropdown.style('font-size', '16px');
  dropdown.option('淡江大學', 'https://www.tku.edu.tw');
  dropdown.option('淡江教科系', 'https://www.et.tku.edu.tw');
  dropdown.changed(updateIframeUrl); // 當選單改變時觸發更新函數

  // 產生一個 DIV，四周距離視窗邊緣 200px
  iframeDiv = createDiv();
  iframeDiv.position(200, 200);
  iframeDiv.size(windowWidth - 400, windowHeight - 400);
  iframeDiv.style('box-shadow', '0 0 15px rgba(0,0,0,0.5)'); // 加上陰影讓邊界更明顯
  iframeDiv.style('opacity', '0.25'); // 將數值調低至 0.05，讓背後的跳動文字更容易透出來

  // 在 DIV 內建立 iframe 來嵌入指定的網頁
  embeddedFrame = createElement('iframe'); // 去掉 let，使用全域變數
  embeddedFrame.attribute('src', dropdown.value()); // 網址預設抓取選單目前的值
  embeddedFrame.style('width', '100%');
  embeddedFrame.style('height', '100%');
  embeddedFrame.style('border', 'none'); // 隱藏 iframe 預設的框線
  embeddedFrame.parent(iframeDiv); // 將 iframe 放進 div 中
}

function draw() {
  background(220);

  // 即時取得滑桿的值並設定為文字大小
  let currentTextSize = slider.value();
  textSize(currentTextSize);

  let str = input.value();
  let strWidth = textWidth(str);

  // 設定文字外框顏色與粗細
  stroke('#cbc0d3');
  strokeWeight(1); // 你可以根據喜好調整外框的粗細數值

  // 如果文字存在且寬度大於 0，則進行繪製
  if (strWidth > 0) {
    // 將 Y 軸的起始位置改為 130，確保它畫在文字方框（底部為 100）的下方
    for (let y = 130; y < height; y += currentTextSize + 20) {
      let colorIndex = 0; // 每一行開始時重置顏色索引，讓每行都從第一個顏色開始
      for (let x = 0; x < width; x += strWidth + 20) {
        
        // 計算跳動的 X 與 Y 軸偏移量
        let offsetX = 0;
        let offsetY = 0;
        if (isBouncing) {
          // 讓跳動距離（振幅）也隨著時間與位置產生變化
          let ampX = 15 + sin(frameCount * 0.03 + y * 0.02) * 10;
          let ampY = 15 + cos(frameCount * 0.03 + x * 0.02) * 10;

          // X 軸與 Y 軸分別使用不同的頻率與相位，產生豐富的上下左右跳動
          offsetX = sin(frameCount * 0.1 + x * 0.02 + y * 0.01) * ampX;
          offsetY = cos(frameCount * 0.12 + x * 0.01 + y * 0.02) * ampY;
        }

        // 設定當前的文字顏色，使用 % 確保即使文字數量超過色票長度也能循環套用
        fill(palette[colorIndex % palette.length]);
        text(str, x + offsetX, y + offsetY);
        colorIndex++; // 換下一個顏色
      }
    }
  }
}

// 切換跳動狀態的函數
function toggleBounce() {
  isBouncing = !isBouncing;
}

// 更新 iframe 網址的函數
function updateIframeUrl() {
  let selectedUrl = dropdown.value();
  embeddedFrame.attribute('src', selectedUrl);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  // 當視窗縮放時，同步更新 DIV 的大小，讓它隨時保持 200px 內距
  iframeDiv.size(windowWidth - 400, windowHeight - 400);
}
