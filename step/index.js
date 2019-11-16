module.exports = async function (context, req) {
    try {
        const currentStepNumber = +req.body.currentStep
        const chosenAnswerNumber = +req.body.chosenAnswer
        const manualEntry = req.body.manualEntry

        if (currentStepNumber === null || currentStepNumber === undefined) {
            context.res = {
                status: 400,
                body: 'Missing required param currentStepNumber'
            }

            return
        }

        const nextStep = findNextStep(context, currentStepNumber, chosenAnswerNumber, manualEntry)
        context.res = {
            body: `${JSON.stringify(nextStep)}`
        }

    } catch (error) {
        context.log(`Caught error: ${JSON.stringify(error)}`)
        context.res = {
            status: 404,
            body: `Step not found with params ${req.body.currentStep} ${req.body.chosenAnswer} ${req.body.manualEntry}`
        }
    }
}

findNextStep = (context, currentStepNumber, chosenAnswerNumber, manualEntry) => {
    const steps = context.bindings.steps

    if (currentStepNumber === 0) {
        const firstStep = steps.find(item => item.step === 1)
        return firstStep
    }

    const currentStep = steps.find(item => item.step === currentStepNumber)
    const currentAnswerOptions = currentStep.answerOptions

    if (currentAnswerOptions) {
        const chosenAnswer = currentAnswerOptions[chosenAnswerNumber]
        const nextStep = steps.find(item => item.step === chosenAnswer.nextStep)

        nextStep.messages = nextStep.messages.map(item => {
            return item.message.replace("%placeholder%", manualEntry ? manualEntry : "Anonymous")
        })

        return nextStep
    }

    return { step: 99, messages: [{ message: "Thanks for playing!" }] }
}