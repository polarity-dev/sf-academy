import random

MAX = 50
N = random.randint(1,MAX)
f = open('exfile.txt', 'w')
a = random.randint(1, N)
b = random.randint(a+1, N)
f.write(f'{a} {b}\n')

dd = 'dummy data'
vd = 'valid data'
i = 1
for i in range(N):
    P = random.randint(1, 5)
    K = random.randint(-200, 200)
    if i >= a-1 and i <= b-1:
        f.write(f'{P} {K} {vd}\n')
    else:
        f.write(f'{P} {K} {dd}\n')

f.close()
