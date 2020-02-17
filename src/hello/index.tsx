import * as React from 'react'
import './index.css'

interface State {
  pieceArray: string[],
  count: number,
  winner: {
    player: string,
    isEnd: boolean
  }
}

const p1: string = '×'
const p2: string = '○'

class TicTacToe extends React.PureComponent {

  state: State = {
    count: 0,
    winner: {
      player: '',
      isEnd: false
    },
    pieceArray: [
      '', '', '',
      '', '', '',
      '', '', ''
    ]
  }

  handleFill = (index: number) => {
    /**
     * 填充P1或P2的输入
     */
    let { count } = this.state
    const copyPieceArray: string[] = [...this.state.pieceArray]
    this.setState({ count: ++count }, () => {
      const { count } = this.state
      copyPieceArray[index] = count % 2 !== 0 ? p1 : p2
      this.setState({ pieceArray: copyPieceArray }, () => this.handleSliceArray())
    })
  }

  handleSliceArray = () => {
    /**
     * rowArray：行
     * columnArray：列
     * outerSlash: 外斜
     * insideSlash: 内斜
     */

    const that = this

    function sliceArray(data: string[]): any[] {
      const result = []
      for (let i = 0; i < data.length; i += 3) {
        result.push(data.slice(i, i + 3))
      }
      return result
    }

    function sliceColumn(data: string[]): string[] {
      const arr = Array(3).fill(undefined).map((_, index) => index)
      const result: string[] = []
      arr.forEach((item) => {
        for (let i = 0, j = item; i < 3; i++ , j += 3) {
          result.push(data[j])
        }
      })
      return result
    }

    function sliceOblique(data: string[], start: number, increment: number) {
      let index = start
      const result = [start, ...Array(2).fill(undefined).map(() => index += increment)].map((item) => data[item])
      return result
    }

    function checkResult(data: any) {
      data.forEach((item: []) => {
        const p1Result = item.every((item) => item === p1)
        const p2Result = item.every((item) => item === p2)
        if (p1Result) {
          that.setState({ winner: { player: 'P1', isEnd: true } })
        }
        if (p2Result) {
          that.setState({ winner: { player: 'P2', isEnd: true } })
        }
      })
    }

    const copyPieceArray: string[] = [...this.state.pieceArray]
    const outerSlash: string[] = sliceOblique(copyPieceArray, 0, 4)
    const insideSlash: string[] = sliceOblique(copyPieceArray, 2, 2)

    const rowArray: string[] = sliceArray(copyPieceArray)
    const columnArray: string[] = sliceArray(sliceColumn(copyPieceArray))
    const slashArray: string[] = sliceArray([...outerSlash, ...insideSlash])

    checkResult(rowArray)
    checkResult(columnArray)
    checkResult(slashArray)

  }

  render() {
    const { pieceArray, winner } = this.state
    const { player, isEnd } = winner
    const result: object[] = pieceArray.map((item, index) => (
      <td data-index={ index } onClick={ () => item ? '' : this.handleFill(index) } key={ index }>{ item }</td>
    ))
    const firstLine: object[] = result.slice(0, 3)
    const secondLine: object[] = result.slice(3, 6)
    const lastLine: object[] = result.slice(6, 9)

    return (
      <div className="box">
        <h1>Winner：{ player }</h1>
        <table className={ isEnd ? 'end' : '' }>
          {
            <thead>
              <tr>{ firstLine }</tr>
            </thead>
          }
          {
            <tbody>
              <tr>{ secondLine }</tr>
              <tr>{ lastLine }</tr>
            </tbody>
          }
        </table>
      </div>
    )
  }
}


export default TicTacToe