package main

import (
	"bufio"
	"fmt"
	"os"
	"time"
)

func timeConversion(s string) string {
	// Parse the input string into a time.Time object
	parsedTime, err := time.Parse("03:04:05PM", s)
	if err != nil {
		fmt.Println("Error parsing time:", err)
		return ""
	}

	// Format the time.Time object to a 24-hour format string
	return parsedTime.Format("15:04:05")
}

func main() {
	// Create a reader for input
	reader := bufio.NewReader(os.Stdin)

	// Read input string
	s, _ := reader.ReadString('\n')
	s = s[:len(s)-1] // Remove the newline character

	// Call timeConversion and print the result
	result := timeConversion(s)
	fmt.Println(result)
}
