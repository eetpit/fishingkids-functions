module.exports = async function (context, req) {
    const currentStepNumber = +req.body.currentStep
    const chosenAnswerNumber = +req.body.chosenAnswer
    const manualEntry = req.body.manualEntry

    if (currentStepNumber === null || currentStepNumber === undefined) {
        context.res = {
            status: 400,
            body: 'Missing required params'
        }

        return
    }

    const steps = context.bindings.steps

    if (currentStepNumber === 0) {
        const firstStep = steps.find(item => {
            return item.step === 1
        })

        context.res = {
            body: `${JSON.stringify(firstStep)}`
        }

        return
    }

    const currentStep = steps.find(item => {
        // context.log(`Finding current step: ${JSON.stringify(item)} \n\n`)
        return item.step === currentStepNumber
    })

    const currentStepAnsweredMessage = currentStep.messages.find(item => item.answerOptions)
    const chosenAnswer = currentStepAnsweredMessage.answerOptions[chosenAnswerNumber]

    const nextStep = steps.find(item => {
        context.log(`Finding next step: ${JSON.stringify(item)} \n\n`)
        return item.step === chosenAnswer.nextStep
    })

    context.log(`Returning step: ${JSON.stringify(nextStep)} \n\n`)

    context.res = {
        body: `${JSON.stringify(nextStep)}`
    }
}