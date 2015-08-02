package api

import (
	. "github.com/onsi/ginkgo"
	. "github.com/onsi/gomega"
)

var _ = Describe("Server", func() {
	It("Should return hello", func() {
		result := "world"
		Expect(result).To(Equal("world"))
	})
})
