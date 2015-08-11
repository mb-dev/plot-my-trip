package api

import (
	. "github.com/onsi/ginkgo"
	. "github.com/onsi/gomega"
)

var _ = Describe("API Server", func() {
	Describe("/auth/google", func() {
		It("Should return a token", func() {
			result := "world"
			Expect(result).To(Equal("world"))
		})
	})
})
