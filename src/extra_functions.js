const randColorNum=()=>{
    return Math.floor(Math.random() * 255) + 1
}

export const randColorArr=()=>{
    return [randColorNum(), randColorNum(), randColorNum()]
}

