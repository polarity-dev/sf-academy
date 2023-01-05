

/* 

  La prima riga(riga indice 0) contiene due numeri A e B 

  Successivamente N righe contenenti: 
    1. un numero P (1 <= P <= 5) che rappresenta la priorità
    2. un numero K
    3. una stringa D

  I dati utili sono quelli compresi tra gli indici A e B

  Lo script deve generare un file con:
    - 1 <= N <= 50
    - A < B <= N



*/


export function genRandomIntegerInclusive(min: number, max: number): number {
  min = Math.ceil(min);
  max = Math.floor(max);
  
  return Math.floor(Math.random() * (max - min + 1) + min); // max and min inclusive
  
}
