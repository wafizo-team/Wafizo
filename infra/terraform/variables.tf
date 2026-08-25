# ─── OVH / OpenStack Auth ────────────────────────────────────────────────────

variable "ovh_endpoint" {
  description = "Endpoint de l'API OVH (ovh-eu pour l'Europe)"
  type        = string
  default     = "ovh-eu"
}

variable "ovh_application_key" {
  description = "Application Key OVH"
  type        = string
  sensitive   = true
}

variable "ovh_application_secret" {
  description = "Application Secret OVH"
  type        = string
  sensitive   = true
}

variable "ovh_consumer_key" {
  description = "Consumer Key OVH"
  type        = string
  sensitive   = true
}

variable "openstack_user" {
  description = "Utilisateur OpenStack"
  type        = string
  sensitive   = true
}

variable "openstack_password" {
  description = "Mot de passe OpenStack"
  type        = string
  sensitive   = true
}

variable "openstack_tenant_name" {
  description = "Nom du projet Public Cloud OVH"
  type        = string
}

variable "openstack_region" {
  description = "Région OVH"
  type        = string
  default     = "GRA11"
}

# ─── Instance ────────────────────────────────────────────────────────────────

variable "instance_name" {
  description = "Nom de l'instance dans OVH"
  type        = string
  default     = "wafizo-prod"
}

variable "instance_flavor" {
  description = "Type d'instance OVH (b3-8 = 4 vCPU / 8 Go RAM)"
  type        = string
  default     = "b3-8"
}

variable "instance_image" {
  description = "Image OS de base"
  type        = string
  default     = "Debian 12"
}

variable "ssh_public_key_path" {
  description = "Chemin vers ta clé publique SSH"
  type        = string
  default     = "~/.ssh/id_ed25519.pub"
}

variable "ssh_key_name" {
  description = "Nom de la keypair dans OVH"
  type        = string
  default     = "wafizo-key"
}

# ─── DNS ─────────────────────────────────────────────────────────────────────

variable "ovh_service_name" {
  description = "ID du projet Public Cloud OVH (visible dans l'URL espace client)"
  type        = string
  sensitive   = true
}

variable "domain_wafizo_fr" {
  description = "Domaine principal"
  type        = string
  default     = "wafizo.fr"
}

variable "domain_wafizo_com" {
  description = "Domaine COM"
  type        = string
  default     = "wafizo.com"
}
