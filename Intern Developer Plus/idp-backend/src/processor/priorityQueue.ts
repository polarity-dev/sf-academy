const tag: string = "PRIORITY QUEUE"

export class PriorityQueue {
    queue: Map<string, string[]> = new Map()
    min_priority: number
    max_priority: number

    constructor(min_priority:number, max_priority:number) {
        this.min_priority = min_priority
        this.max_priority = max_priority

        for (let i = this.min_priority; i <= this.max_priority; i++) {
            this.queue.set(String(i), [])
        }
    }

    // If the priority is between min and max priority, adds data to queue and returns true
    // Otherwise returns false
    insert(priority: string, value: string): boolean {
        const pr = Number(priority)
        if (!pr || pr < this.min_priority || pr > this.max_priority) {
            return false
        }

        this.queue.get(priority)!.push(value)
        return true
    }

    // Returns the data to process and the priority level of the batch
    // The priority level can be used to put data back in queue in case it couldn't be processed
    getNDataByPriority(n: number): [string[], number] {
        let tmp: string[] = []
        let i: number = this.max_priority

        // If the queue is empty we return an empty array and what would be the result of the for cycle if it
        // found nothing in the queue itself. This is for consistency
        if (this.queueLen() == 0) {
            return [tmp, this.min_priority - 1]
        }

        // We check every queue by priority and once we find suitable data, we take it until we have n elements
        // or, we emptied the current queue level
        for (; i >= this.min_priority; i--) {
            console.log(`\n\n[${tag}]: Current priority level is ${i}`)
            const array_length:number = this.priorityLen(i)

            // If there are no elements we go to a lower priority
            if (array_length == 0) {
                console.log(`\n\n[${tag}]: No elements at level ${i}`)

            // Otherwise we take up to n elements or until the priority array is empty
            } else {
                console.log(`[${tag}]: array length is: ${array_length}`)

                const to_take: number = Math.min(n, array_length)
                tmp = this.queue.get(String(i))!.splice(0, to_take)

                break
            }
        }

        console.log(`\n\n[${tag}]: priority queue is:`)
        console.dir(this.queue)

        return [tmp, i]
    }

    // I made this function initially but the requirements mention processing all the data in the higher priorities
    // before touching the lower ones. Since I already made it, I'll leave it here
    getNData(n: number): string[] {
        let tmp: string[] = []

        // If the queue is empty we just return nothing
        if (this.queueLen() == 0) {
            return tmp
        }

        for (let i = this.max_priority; i >= this.min_priority; i--) {
            console.log(`\n\n[${tag}]: Current priority level is ${i}`)
            const array_length: number = this.priorityLen(i)

            // If the number of elements is 0 < n < 15, we take what is left until we fill tmp or go to a lower priority
            if (0 < array_length && array_length < n) {
                console.log(`[${tag}]: array length is: ${array_length}`)
                // We take all elements if we need more than what's left at this level. Otherwise, we take how many we need
                const elements_needed:number = n - tmp.length
                const to_take: number = Math.min(elements_needed, array_length)
                tmp = tmp.concat(this.queue.get(String(i))!.splice(0, to_take))

                console.log(`\n[${tag}]: Took needed elements at level ${i}`)
                console.log(`[${tag}]: tmp is ${tmp}`)

                // If there are no elements we go to a lower priority
            } else if (array_length == 0){
                console.log(`\n\n[${tag}]: No elements at level ${i}`)
                continue

                // If we have enough elements, we take them all and return the array
            } else if (array_length >= n) {
                tmp = this.queue.get(String(i))!.splice(0, n)
                break
            }
            // If we reach the length we needed, we stop taking more elements
            // >= is failsafe to not keep looping if for some strange reason we exceed the number of elements
            if (tmp.length >= n) {
                break
            }
        }

        console.log(`\n\n[${tag}]: priority queue is:`)
        console.dir(this.queue)

        return tmp
    }

    // Returns the length of the queue of priority i
    priorityLen(i: number): number {
        return this.queue.get(String(i))!.length
    }

    queueLen(): number {
        let sum = 0
        for (let [, value] of this.queue) {
            sum += value.length
        }
        return sum
    }

    getQueueMap(): Map<string, string[]> {
        return this.queue
    }

}