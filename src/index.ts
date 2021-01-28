import './index.scss'

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
  let xOffset: Offset[] = []
  let oOffset: Offset[] = []
  // 遍历row,col
  const rows = document.querySelectorAll('.row')
  rows.forEach((rowItem, rowIndex) => {
    const row = rowItem as HTMLDivElement
    const childNodes = row.children
    for (let i: number = 0; i < childNodes.length; i++) {
      if (childNodes[i].classList.contains('x')) {
        xOffset.push({ row: rowIndex, col: i })
      }
      if (childNodes[i].classList.contains('o')) {
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
    let tmpOffset = offset.slice(-3)
    console.log(tmpOffset)
    if (
      tmpOffset[0].row === tmpOffset[1].row &&
      tmpOffset[1].row === tmpOffset[2].row
    ) {
      return true
    }
    if (
      tmpOffset[0].col === tmpOffset[1].col &&
      tmpOffset[1].col === tmpOffset[2].col
    ) {
      return true
    }
    if (
      tmpOffset[0].row === tmpOffset[0].col &&
      tmpOffset[1].row === tmpOffset[1].col &&
      tmpOffset[2].row === tmpOffset[2].col
    ) {
      return true
    }
    if (
      tmpOffset[0].row === tmpOffset[2].col &&
      tmpOffset[0].col === tmpOffset[2].row &&
      tmpOffset[1].row === tmpOffset[1].col
    ) {
      return true
    }
    return false
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
