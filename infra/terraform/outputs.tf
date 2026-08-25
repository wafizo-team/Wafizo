output "instance_ip" {
  description = "IP publique de l'instance Wafizo"
  value       = openstack_compute_instance_v2.wafizo.access_ip_v4
}

output "instance_id" {
  description = "ID de l'instance (utile pour les snapshots OVH)"
  value       = openstack_compute_instance_v2.wafizo.id
}

output "volume_id" {
  description = "ID du volume de données"
  value       = openstack_blockstorage_volume_v3.wafizo_data.id
}

output "ssh_command" {
  description = "Commande SSH pour se connecter à l'instance"
  value       = "ssh admin@${openstack_compute_instance_v2.wafizo.access_ip_v4}"
}
