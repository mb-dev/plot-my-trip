package api_test

import (
	"testing"

	. "github.com/onsi/ginkgo"
	. "github.com/onsi/gomega"
)

func TestPlotMyTrip(t *testing.T) {
	RegisterFailHandler(Fail)
	RunSpecs(t, "PlotMyTrip Suite")
}
