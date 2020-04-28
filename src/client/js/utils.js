export const shuffle = (a, times) => {
    if (times > 0) {
        let j, x, i
        for (i = a.length - 1; i > 0; i--) {
            j = Math.floor(Math.random() * (i + 1))
            x = a[i]
            a[i] = a[j]
            a[j] = x
        }
        shuffle(a, --times)
    }
}

export const randomElement = l => l[ Math.floor( Math.random() * l.length ) ]

export const nub = list => list.filter(
    (elem, index, arr) => index === arr.findIndex(
        e => JSON.stringify(e) === JSON.stringify(elem)
    )
)

export const findElement = (elem, list) => list.find(
    e => JSON.stringify(e) === JSON.stringify(elem)
)

export const fix = f => f(f)
