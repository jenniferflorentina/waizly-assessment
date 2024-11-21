package main

import (
	"bufio"
	"fmt"
	"os"
	"strconv"
	"strings"
)

func miniMaxSum(arr []int) {
	min := arr[0]
	max := arr[0]
	var sum int64

	for _, num := range arr {
		sum += int64(num)
		if num < min {
			min = num
		}
		if num > max {
			max = num
		}
	}

	fmt.Printf("%d %d\n", sum-int64(max), sum-int64(min))
}

func main() {
	reader := bufio.NewReader(os.Stdin)
	input, _ := reader.ReadString('\n')
	input = strings.TrimSpace(input)

	strNums := strings.Split(input, " ")
	var arr []int

	for _, str := range strNums {
		num, _ := strconv.Atoi(str)
		arr = append(arr, num)
	}

	miniMaxSum(arr)
}
