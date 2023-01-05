

/* 

  La prima riga(riga indice 0) contiene due numeri A e B 

  Successivamente N righe contenenti: 
    1. un numero P (1 <= P <= 5) che rappresenta la priorità
    2. un numero K
    3. una stringa D

  I dati utili sono quelli compresi tra gli indici A e B

  Lo script deve generare un file con:
    - 1 <= N <= 50
    - 0 <= A < B <= N



*/
// function that return a random integer betwean a min and a max (BOTH OF THEM ARE INCLUSIVE)
const genIntegerInclusive = (min: number, max: number) => {

  min = Math.ceil(min);
  max = Math.floor(max);

  return Math.floor(Math.random() * (max - min + 1) + min);
}


// function that return a random integer betwean a min and a max (ONLY THE MIN IS INCLUSIVE)
const genInteger = (min: number, max: number) => {

  min = Math.ceil(min);
  max = Math.floor(max);

  return Math.floor(Math.random() * (max - min) + min);
}

// used to generate the number in range betwean 1 and 50 (inclusive)
export const genNAB = () => {

  let file_specs = {
    "N": 0,
    "A": 0,
    "B": 0
  }

  let n_min: number = 1;
  let n_max: number = 50;

  file_specs.N = genIntegerInclusive(n_min, n_max);

  // b_min is 1 becouse A and B can't be equal and if be value is 0, the A value if 0 
  let b_min = 1;
  let b_max = file_specs.N;

  file_specs.B = genIntegerInclusive(b_min, b_max);

  let a_min = 0;
  let a_max = file_specs.B;
  // chose to use the not inclusive version to avoid collision betwean A and B
  file_specs.A = genInteger(a_min, a_max);

  return file_specs;
}

export const genP = (): number => {
  return genIntegerInclusive(1, 5)
}
