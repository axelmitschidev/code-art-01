let population = 100
let count = 0

const count_element = document.getElementById('count')
const btn_element = document.getElementById('btn-enter')

const body_dim = {
    width: document.body.offsetWidth,
    height: document.body.offsetHeight,
}

const random_b_color = Math.random() * 255

let audioContext
const partition5 = partitionTransfomer(
    '----------CDC-----------C-\
     -CeDeCF-G-DD--dC----C-d-dC\
     -CDFGDFCD-C-D-F-GDFCD-dDdC\
     -Cd--CDFCDC-C---C-F-G-DD--\
     dC----C-d-dC-CDFGDFCD-C-D-\
     F-GDFCD-dDdC-Cd--CDFCDC-C-\
     --C----------CD-eDeF------\
     --eDC---------------CD----\
     --------eDeF-------------C\
     D-eDeF--------eDC---------\
     C-------------------------'
, 5)

const partition4 = partitionTransfomer(
    'DeF-b-DeFb---Ab-F-DeF-b--A\
     b------------b--b-b-------\
     b--------b-b---------b----\
     b---b------b--b----------b\
     --b-b-------b--------b-b--\
     -------b----b---b------b--\
     b---b-FGb-FGb--b----b-b-FG\
     bF---bFDeFb-FGb-FGbb--bFGF\
     b-bAbFGb----b-G-b-FGb-FGb-\
     -b----b-b-FGbF---bFDeFb-FG\
     b-FGbb--bFGFb-bAbFGb----b-\
     --------------------------'
, 4)

const partition = partitionMerger(partition5, partition4)

function partitionTransfomer(partition_str, octave) {
    const association_list = [
        ['4c', 523],
        ['4C', 554],
        ['4d', 587],
        ['4D', 622],
        ['4e', 659],
        ['4f', 698],
        ['4F', 739],
        ['4g', 783],
        ['4G', 830],
        ['4a', 880],
        ['4A', 932],
        ['4b', 987],

        ['5c', 1046],
        ['5C', 1108],
        ['5d', 1174],
        ['5D', 1244],
        ['5e', 1318],
        ['5f', 1396],
        ['5F', 1479],
        ['5g', 1567],
        ['5G', 1661],
        ['5a', 1760],
        ['5A', 1864],
        ['5b', 1975],
    ]

    let partition_arr = []

    for (let i = 0; i < partition_str.length; i += 1) {
        const n = octave + partition_str[i]
        const index = association_list.findIndex(item => item[0] === n)
        if (index === -1) 
            partition_arr.push(0)
        else
            partition_arr.push(association_list[index][1])
    }

    return partition_arr
}

function partitionMerger(part_main, part_pull) {
    const merged_partition = []

    for (let i = 0; i < part_main.length; i++) {
        if (part_main[i] === 0) {
            merged_partition.push(part_pull[i])
        } else {
            merged_partition.push(part_main[i])
        }
    }

    return merged_partition
}

function playNote(frequency) {
    new Promise((resolve) => {
        const gain = new GainNode(audioContext)
        gain.connect(audioContext.destination)
        gain.gain.value = 0.02

        const oscillator = new OscillatorNode(audioContext)
        oscillator.connect(gain)
        oscillator.type = 'sine'
        oscillator.frequency.value = frequency
        oscillator.start()

        setTimeout(() => {
            oscillator.stop()
            resolve()
        }, 100)
    })
}

window.addEventListener('mousemove', e => {
    const mouse = {
        x: e.clientX,
        y: e.clientY
    }

    document.body.style.backgroundColor = `rgb(${
        mouse.x / body_dim.width * 255
    }, ${
        mouse.y / body_dim.height * 255
    }, 128)`
})

btn_element.addEventListener('click', () => {
    btn_element.remove()

    audioContext = new AudioContext()

    setInterval(() => {
        const boxs = document.querySelectorAll('.box')
        if (boxs.length > population) boxs[boxs.length - 1].remove()
        if (boxs.length < population) {
            const box_dim = { width: (10 + Math.random() * (100 - 10)), height: (10 + Math.random() * (100 - 10)) }
            const div = document.createElement('div')
            div.classList.add('box')
        
            div.addEventListener('mousemove', () => {
                count++
                count_element.textContent = count
                playNote(partition[count % partition.length])
                div.remove()
            })
        
            div.style.position = 'absolute'
            div.style.top = `${ Math.random() * body_dim.height - box_dim.height }px`
            div.style.left = `${ Math.random() * body_dim.width - box_dim.width }px`
            div.style.width = `${ box_dim.width }px`
            div.style.height = `${ box_dim.height }px`
            div.style.transform = `rotate(${ Math.random() * 360 }deg)`
            div.style.borderColor = `rgba(0, 0, 0, ${Math.random()})`
            div.style.borderRadius = `${Math.round(Math.abs(Math.sin(count / 10000) * 100))}px`
    
            document.body.prepend(div)
        }
    }, 1)
})
