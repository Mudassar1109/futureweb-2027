"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

async function requireUser() {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) redirect("/?auth=required");
  return { supabase, user };
}
export async function createWorkspace(formData: FormData) {
  const { supabase, user } = await requireUser();
  const name = String(formData.get("name") ?? "").trim();
  const objective = String(formData.get("objective") ?? "").trim();
  if (!name || !objective) throw new Error("Workspace name and objective are required.");
  const { data, error } = await supabase.from("workspaces").insert({ user_id: user.id, name, objective }).select("id").single();
  if (error) throw new Error(error.message);
  const starterTasks = ["Define the customer problem","Research the target audience","Outline the first version","Choose the next measurable milestone"];
  const { error: taskError } = await supabase.from("workspace_tasks").insert(starterTasks.map((title,index)=>({workspace_id:data.id,user_id:user.id,title,category:"Planning",sort_order:index})));
  if (taskError) throw new Error(taskError.message);
  revalidatePath("/dashboard");
}
export async function addTask(formData: FormData) {
  const { supabase, user } = await requireUser();
  const workspaceId = String(formData.get("workspace_id") ?? "");
  const title = String(formData.get("title") ?? "").trim();
  if (!workspaceId || !title) return;
  const { error } = await supabase.from("workspace_tasks").insert({ workspace_id:workspaceId,user_id:user.id,title,category:"General" });
  if (error) throw new Error(error.message);
  revalidatePath("/dashboard");
}
export async function toggleTask(formData: FormData) {
  const { supabase, user } = await requireUser();
  const id = String(formData.get("id") ?? "");
  const status = String(formData.get("status") ?? "");
  if (!id || !["todo","done"].includes(status)) return;
  const { error } = await supabase.from("workspace_tasks").update({status:status==="done"?"todo":"done"}).eq("id",id).eq("user_id",user.id);
  if (error) throw new Error(error.message);
  revalidatePath("/dashboard");
}
export async function deleteTask(formData: FormData) {
  const { supabase, user } = await requireUser();
  const id = String(formData.get("id") ?? "");
  const { error } = await supabase.from("workspace_tasks").delete().eq("id",id).eq("user_id",user.id);
  if (error) throw new Error(error.message);
  revalidatePath("/dashboard");
}
export async function signOut() {
  const { supabase } = await requireUser();
  await supabase.auth.signOut();
  redirect("/");
}