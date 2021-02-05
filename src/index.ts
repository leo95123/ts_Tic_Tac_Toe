// 定义下棋枚举类型
enum Player {
  x,
  o,
}
// 定义坐标
interface Offset {
  row: number
  col: number
}
// 现在player
let nowPlayer = Player['x']

// 切换player
const changePlayer = (nowPlayer: Player) => {
  if (nowPlayer === Player['x']) {
    return Player['o']
  } else return Player['x']
}

// 遍历清除mouseover和click事件
const clearEvent = () => {
  const cells = document.querySelectorAll('.cell')
  cells.forEach((item) => {
    let cell = item as HTMLDivElement
    cell.removeEventListener('mouseover', cellMouseOver)
    cell.removeEventListener('click', handleClick)
  })
}

// 获取赢家
const getWinner = () => {
  // 记录走棋步骤
  let xOffset: Offset[] = []
  let oOffset: Offset[] = []
  // 遍历row,col,获取步骤
  const rows = document.querySelectorAll('.row')
  rows.forEach((rowItem, rowIndex) => {
    const row = rowItem as HTMLDivElement
    const childNodes = row.children
    for (let i: number = 0; i < childNodes.length; i++) {
      if (childNodes[i].classList.contains('x')) {
        if (xOffset.indexOf({ row: rowIndex, col: i }) === -1)
          xOffset.push({ row: rowIndex, col: i })
      }
      if (childNodes[i].classList.contains('o')) {
        if (oOffset.indexOf({ row: rowIndex, col: i }) === -1)
          oOffset.push({ row: rowIndex, col: i })
      }
    }
  })
  // 获取赢家
  const winnerDiv = document.getElementById('winner')
  if (isWin(xOffset) && winnerDiv !== null) {
    winnerDiv.innerHTML = 'X 赢了!'
    clearEvent()
    return
  }
  if (isWin(oOffset) && winnerDiv !== null) {
    winnerDiv.innerHTML = 'O 赢了!'
    clearEvent()
    return
  }
  if (xOffset.length + oOffset.length >= 9 && winnerDiv !== null) {
    winnerDiv.innerHTML = '平局!'
    clearEvent()
    return
  }
}
// 判断输赢
const isWin = (offset: Offset[]): boolean => {
  if (offset.length >= 3) {
    // 判断行
    if (
      isOn(offset, { row: 0, col: 0 }) &&
      isOn(offset, { row: 0, col: 1 }) &&
      isOn(offset, { row: 0, col: 2 })
    ) {
      return true
    }
    if (
      isOn(offset, { row: 1, col: 0 }) &&
      isOn(offset, { row: 1, col: 1 }) &&
      isOn(offset, { row: 1, col: 2 })
    ) {
      return true
    }
    if (
      isOn(offset, { row: 2, col: 0 }) &&
      isOn(offset, { row: 2, col: 1 }) &&
      isOn(offset, { row: 2, col: 2 })
    ) {
      return true
    }
    // 判断列
    if (
      isOn(offset, { row: 0, col: 0 }) &&
      isOn(offset, { row: 1, col: 0 }) &&
      isOn(offset, { row: 2, col: 0 })
    ) {
      return true
    }
    if (
      isOn(offset, { row: 0, col: 1 }) &&
      isOn(offset, { row: 1, col: 1 }) &&
      isOn(offset, { row: 2, col: 1 })
    ) {
      return true
    }
    if (
      isOn(offset, { row: 0, col: 2 }) &&
      isOn(offset, { row: 1, col: 2 }) &&
      isOn(offset, { row: 2, col: 2 })
    ) {
      return true
    }
    // 判断斜线
    if (
      isOn(offset, { row: 0, col: 0 }) &&
      isOn(offset, { row: 1, col: 1 }) &&
      isOn(offset, { row: 2, col: 2 })
    ) {
      return true
    }
    if (
      isOn(offset, { row: 0, col: 2 }) &&
      isOn(offset, { row: 1, col: 1 }) &&
      isOn(offset, { row: 2, col: 0 })
    ) {
      return true
    }
  }
  return false
}

// 判断是否在棋盘某个位置上
const isOn = (offsets: Offset[], point: Offset) => {
  for (let i = 0; i < offsets.length; i++) {
    if (offsets[i].row === point.row && offsets[i].col === point.col) {
      return true
    }
  }
  return false
}
// 悬浮事件
const cellMouseOver = (e: MouseEvent) => {
  let target = e.target as HTMLDivElement
  target.classList.add(`${Player[nowPlayer]}-before`)
}
// click事件
const handleClick = (e: MouseEvent): void => {
  let target = e.target as HTMLDivElement
  target.classList.remove(`${Player[nowPlayer]}-before`)
  // 解绑mouseover
  target.removeEventListener('mouseover', cellMouseOver)
  target.classList.add(`${Player[nowPlayer]}`)
  nowPlayer = changePlayer(nowPlayer)
  getWinner()
}

// 复位
const handleInit = () => {
  // 重置player
  nowPlayer = Player['x']
  // 重置信息提示
  const winnerDiv = document.getElementById('winner')
  if (winnerDiv) winnerDiv.innerHTML = ''
  // 处理cells
  const cells = document.querySelectorAll('.cell')
  cells.forEach((item) => {
    let cell = item as HTMLDivElement
    cell.classList.remove('x-before')
    cell.classList.remove('o-before')
    cell.classList.remove('x')
    cell.classList.remove('o')
    // 悬浮显示
    cell.addEventListener('mouseover', cellMouseOver)
    cell.addEventListener('mouseout', function (e) {
      let target = e.target as HTMLDivElement
      target.classList.remove(`${Player[nowPlayer]}-before`)
    })
    // 点击落子
    cell.addEventListener('click', handleClick, { once: true })
  })
}

// 重新开始
const restart = document.getElementById('restart')
if (restart) {
  restart.addEventListener('click', function () {
    handleInit()
  })
}

handleInit()
