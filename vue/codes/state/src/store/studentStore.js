import { defineStore } from "pinia";

export const useStudentStore = defineStore("student", {
  state: () => ({
    name: "avc",
    age: 22,
    gender: "male",
    address: "ajfijsi",
    skills: ["1", "2", "3"],
  }),
});
