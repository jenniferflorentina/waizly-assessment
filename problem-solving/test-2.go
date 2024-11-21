package main

import (
	"fmt"
)

func positiveNegativeZero(arr []int) {
	len := float64(len(arr)) // Convert to float64 for ratio calculations

	positiveCount := 0
	negativeCount := 0
	zeroCount := 0

	// Traverse the array and count the total number of
	// positive, negative, and zero elements.
	for _, num := range arr {
		if num > 0 {
			positiveCount++
		} else if num < 0 {
			negativeCount++
		} else {
			zeroCount++
		}
	}

	// Print the ratios up to six decimal places.
	fmt.Printf("%.6f\n", float64(positiveCount)/len)
	fmt.Printf("%.6f\n", float64(negativeCount)/len)
	fmt.Printf("%.6f\n", float64(zeroCount)/len)
}

func main() {
	var n int
	fmt.Scan(&n) // Read the size of the array

	arr := make([]int, n) // Create an array of size n

	// Read the elements of the array
	for i := 0; i < n; i++ {
		fmt.Scan(&arr[i])
	}

	// Calculate and print the ratios
	positiveNegativeZero(arr)
}
