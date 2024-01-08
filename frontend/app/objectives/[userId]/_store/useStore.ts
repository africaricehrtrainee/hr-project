import { create } from "zustand";

interface Data {
    // SLICES
    selectedEvaluationStep: 0 | 1 | 2;
    selectedObjectiveIndex: number;
    objectives: Objective[];
    objectivesLocal: Objective[] | null;
    comments: Comment[];
    evaluations: Evaluation[];
    evaluationSteps: Step[];
    objectiveEvaluations: ObjectiveEvaluation[];
    objectiveEvaluationsLocal: ObjectiveEvaluation[];
    employee: EmployeeResult | null;
}

interface Actions {
    // ACTIONS
    setObjectives: (to: Objective[]) => void;
    setObjectivesLocal: (to: Objective[] | null) => void;
    setComments: (to: Comment[]) => void;
    setEvaluations: (to: Evaluation[]) => void;
    setEvaluationSteps: (to: Step[]) => void;
    setObjectiveEvaluations: (to: ObjectiveEvaluation[]) => void;
    setObjectiveEvaluationsLocal: (to: ObjectiveEvaluation[]) => void;
    setEmployee: (to: EmployeeResult) => void;
    setSelectedEvaluationStep: (to: 0 | 1 | 2) => void;
    setSelectedObjectiveIndex: (to: number) => void;
    reset: () => void;
}
const initialState: Data = {
    // SLICES
    objectives: [],
    objectivesLocal: [],
    comments: [],
    evaluations: [],
    objectiveEvaluations: [],
    objectiveEvaluationsLocal: [],
    employee: null,
    selectedEvaluationStep: 0,
    evaluationSteps: [],
    selectedObjectiveIndex: -1,
};
export const useObjectivesDataStore = create<Data & Actions>((set) => ({
    ...initialState,
    // ACTIONS
    setObjectives: (to) => set((state) => ({ objectives: to })),
    setObjectivesLocal: (to) => set((state) => ({ objectivesLocal: to })),
    setComments: (to) => set((state) => ({ comments: to })),
    setEvaluations: (to) => set((state) => ({ evaluations: to })),
    setObjectiveEvaluations: (to) =>
        set((state) => ({ objectiveEvaluations: to })),
    setObjectiveEvaluationsLocal: (to) =>
        set((state) => ({ objectiveEvaluations: to })),
    setEmployee: (to) => set((state) => ({ employee: to })),
    setSelectedEvaluationStep: (to) =>
        set((state) => ({ selectedEvaluationStep: to })),
    setEvaluationSteps: (to) => set((state) => ({ evaluationSteps: to })),
    setSelectedObjectiveIndex: (to) =>
        set((state) => ({ selectedObjectiveIndex: to })),
    reset: () => {
        set(initialState);
    },
}));

export const selectActiveStep = (state: Data) =>
    state.evaluationSteps.findIndex((step) => step.active);

export const selectActiveObjective = (state: Data) =>
    state.objectivesLocal
        ? state.objectivesLocal.find(
              (objectives, index) => index === state.selectedObjectiveIndex
          )
        : null;
