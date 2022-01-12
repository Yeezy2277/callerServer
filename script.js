let arr = [
    [0, 1, 0],
    [0, 1, 0],
    [0, 1, 0]
];

function translatePattern(pattern) {
    let liveNeighboursCount = 0;
    let deathNeighboursCount = 0;
    for (let i = 0; i < pattern.length; i++) {
        for (let j = 0; j < pattern[i].length; j++) {
            try {
                pattern[i][j + 1] === 1 ? liveNeighboursCount++ : null
            } catch {
                return;
            }
            try {
                pattern[i + 1][j + 1] === 1 ? liveNeighboursCount++ : null;
            } catch {
                return;
            }
            try {
                pattern[i + 1][j - 1] === 1 ? liveNeighboursCount++ : null;
            } catch {
                return;
            }
            try {
                pattern[i][j + 1] === 0 ? deathNeighboursCount++ : null
            } catch {
                return;
            }
            try {
                pattern[i + 1][j + 1] === 0 ? deathNeighboursCount++ : null;
            } catch {
                return;
            }
            try {
                pattern[i + 1][j - 1] === 0 ? deathNeighboursCount++ : null;
            } catch {
                return;
            }
            pattern[i][j] === 0 && liveNeighboursCount === 3 ? pattern[i][j] = 1
                : pattern[i][j] === 1 && deathNeighboursCount < 2 || pattern[i][j] === 1 && deathNeighboursCount === 2 ||
                pattern[i][j] === 1 && deathNeighboursCount === 3 ? pattern[i][j] = 0 : null;
        }
    }
    return pattern;
}

console.log(translatePattern(arr));
